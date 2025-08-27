/*:
 * @target MZ
 * @plugindesc News Management System v1.0.1
 * @author YourName
 * @url 
 * @help
 * ============================================================================
 * News Management Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin manages news events and market effects for your game.
 * It can work standalone or integrate with the Real Estate System.
 * 
 * Features:
 * - Procedural news generation
 * - Real/hardcoded news events at 8AM daily
 * - Market effects on properties
 * - News history tracking
 * - Soul tendency system integration
 * - Multi-language support (English/Italian)
 * 
 * Plugin Commands:
 * - Check News History
 * - Force News Event (for testing)
 * 
 * @command checkNewsHistory
 * @text Check News History
 * @desc Shows recent market news
 * 
 * @command forceNewsEvent
 * @text Force News Event
 * @desc Forces a news event to occur (for testing)
 */

(() => {
    'use strict';
    
    const pluginName = 'NewsSystem';
    
    // Language check function
    window.NewsSystemUtils = window.NewsSystemUtils || {};
    
    window.NewsSystemUtils.isItalian = function() {
        return ConfigManager.language === "it";
    };
    
    // Get News Data
    const { News, Translations, RealNews } = window.NewsData || { News: {}, Translations: {}, RealNews: [] };
    
    // Export translations for other plugins
    window.NewsSystemUtils.Translations = Translations;
    
    // Get translation function
    window.NewsSystemUtils.t = function(key, replacements = {}) {
        const lang = window.NewsSystemUtils.isItalian() ? 'it' : 'en';
        let text = Translations[lang][key] || Translations.en[key] || key;
        
        // Handle replacements
        Object.keys(replacements).forEach(placeholder => {
            text = text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
        });
        
        return text;
    };
    
    const t = window.NewsSystemUtils.t;
    
    // European locations with Italian Translations
    window.NewsSystemUtils.LOCATIONS = {
        en: [
            'Paris, France', 'Rome, Italy', 'Barcelona, Spain', 'Berlin, Germany',
            'Amsterdam, Netherlands', 'Prague, Czech Republic', 'Vienna, Austria',
            'Lisbon, Portugal', 'Athens, Greece', 'Budapest, Hungary',
            'Copenhagen, Denmark', 'Stockholm, Sweden', 'Dublin, Ireland',
            'Brussels, Belgium', 'Warsaw, Poland', 'Zurich, Switzerland',
            'Edinburgh, Scotland', 'Oslo, Norway', 'Helsinki, Finland',
            'Venice, Italy', 'Nice, France', 'Munich, Germany',
            'Santorini, Greece', 'Dubrovnik, Croatia', 'Reykjavik, Iceland',
            'Malta', 'Luxembourg', 'Monaco', 'Ljubljana, Slovenia', 'Tallinn, Estonia', 'Washington, United States',  'New York, United States'
        ],
        it: [
            'Parigi, Francia', 'Roma, Italia', 'Barcellona, Spagna', 'Berlino, Germania',
            'Amsterdam, Paesi Bassi', 'Praga, Repubblica Ceca', 'Vienna, Austria',
            'Lisbona, Portogallo', 'Atene, Grecia', 'Budapest, Ungheria',
            'Copenaghen, Danimarca', 'Stoccolma, Svezia', 'Dublino, Irlanda',
            'Bruxelles, Belgio', 'Varsavia, Polonia', 'Zurigo, Svizzera',
            'Edimburgo, Scozia', 'Oslo, Norvegia', 'Helsinki, Finlandia',
            'Venezia, Italia', 'Nizza, Francia', 'Monaco, Germania',
            'Santorini, Grecia', 'Dubrovnik, Croazia', 'Reykjavik, Islanda',
            'Malta', 'Lussemburgo', 'Monaco', 'Lubiana, Slovenia', 'Tallinn, Estonia', 'Washington, Stati Uniti', 'New York, Stati Uniti'
        ]
    };
    
    window.NewsSystemUtils.getLocations = function() {
        return window.NewsSystemUtils.isItalian() ? 
            window.NewsSystemUtils.LOCATIONS.it : 
            window.NewsSystemUtils.LOCATIONS.en;
    };
    
    // News Manager Class
    class NewsManager {
        constructor() {
            this.newsHistory = [];
            this.activeEffects = [];
            this.currentHour = new Date().getHours();
            this.lastDailyNewsCheck = null;
            this.usedRealNewsIds = new Set();
            this.newsListeners = [];
        }
        
        // Register a listener for news events
        registerListener(callback) {
            this.newsListeners.push(callback);
        }
        
        // Notify all listeners of news events
        notifyListeners(news, duration) {
            this.newsListeners.forEach(callback => {
                if (typeof callback === 'function') {
                    callback(news, duration);
                }
            });
        }
        
        initialize() {
            console.log('NewsManager: Initializing...');
            console.log('NewsManager: RealNews data available:', RealNews ? RealNews.length : 0, 'items');
            
            // First generate past real news to show historical context
            this.generatePastRealNews();
            
            // Then generate procedural news mixed throughout the timeline
            this.generateInitialProceduralNews();
            
            this.lastDailyNewsCheck = new Date();
            this.startHourlyUpdates();
            
            console.log('NewsManager: Initialization complete. Total news items:', this.newsHistory.length);
        }
        
        // Parse date from DD/MM/YYYY format
        parseDateString(dateString) {
            const [day, month, year] = dateString.split('/').map(num => parseInt(num, 10));
            return new Date(year, month - 1, day);
        }
        
        // Parse date and create current year version
        parseDateToCurrentYear(dateString) {
            const [day, month, year] = dateString.split('/').map(num => parseInt(num, 10));
            const currentYear = new Date().getFullYear();
            return new Date(currentYear, month - 1, day);
        }
        
        // Check if a date matches today
        isDateToday(dateString) {
            const [day, month] = dateString.split('/').map(num => parseInt(num, 10));
            const today = new Date();
            return today.getDate() === day && (today.getMonth() + 1) === month;
        }
        
        // Check if a date is from January 1st of current year to now
        isDateSinceJanuary1st(dateString) {
            const [day, month, originalYear] = dateString.split('/').map(num => parseInt(num, 10));
            const now = new Date();
            const currentYear = now.getFullYear();
            const january1st = new Date(currentYear, 0, 1); // January 1st of current year
            
            // Check current year date
            const currentYearDate = new Date(currentYear, month - 1, day);
            
            return currentYearDate >= january1st && currentYearDate <= now;
        }
        
        // Check if we need to process daily news
        shouldProcessDailyNews() {
            const now = new Date();
            
            if (!this.lastDailyNewsCheck) {
                return true;
            }
            
            const lastCheck = new Date(this.lastDailyNewsCheck);
            
            // Check if it's a new day
            if (now.getDate() !== lastCheck.getDate() || 
                now.getMonth() !== lastCheck.getMonth() || 
                now.getFullYear() !== lastCheck.getFullYear()) {
                return true;
            }
            
            return false;
        }
        
        // Check if we need to process timed news for today
        shouldProcessTimedNews() {
            if (!RealNews || !Array.isArray(RealNews)) return [];
            
            const now = new Date();
            const todaysNews = RealNews.filter(newsItem => {
                return this.isDateToday(newsItem.date) && !this.usedRealNewsIds.has(newsItem.title);
            });
            
            // Filter news that should be shown at current time
            return todaysNews.filter(newsItem => {
                if (!newsItem.time) return false;
                
                const [hours, minutes] = newsItem.time.split(':').map(num => parseInt(num, 10));
                const newsTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
                
                // Show news if current time is at or past the scheduled time
                return now >= newsTime;
            });
        }
        
        // Process daily hardcoded news
        processDailyNews() {
            if (!RealNews || !Array.isArray(RealNews)) {
                console.log('NewsManager: No RealNews data available for daily processing');
                return;
            }
            
            console.log('NewsManager: Processing daily news...');
            
            const todaysNews = RealNews.filter(newsItem => {
                return this.isDateToday(newsItem.date) && !this.usedRealNewsIds.has(newsItem.title);
            });
            
            console.log('NewsManager: Found', todaysNews.length, 'news items for today');
            
            // Sort today's news by time if available
            todaysNews.sort((a, b) => {
                const timeA = a.time || "08:00";
                const timeB = b.time || "08:00";
                return timeA.localeCompare(timeB);
            });
            
            todaysNews.forEach(newsItem => {
                this.addRealNewsItem(newsItem, false); // false = not historical
                this.usedRealNewsIds.add(newsItem.title);
            });
            
            this.lastDailyNewsCheck = new Date();
        }
        
        // Process timed news that should appear now
        processTimedNews() {
            const timedNews = this.shouldProcessTimedNews();
            
            if (timedNews.length > 0) {
                console.log('NewsManager: Processing', timedNews.length, 'timed news items');
                
                timedNews.forEach(newsItem => {
                    this.addRealNewsItem(newsItem, false); // false = not historical, show notification
                    this.usedRealNewsIds.add(newsItem.title);
                });
            }
        }
        
        // Add a real news item
        addRealNewsItem(newsItem) {
            const lang = window.NewsSystemUtils.isItalian() ? 'it' : 'en';
            const title = lang === 'it' && newsItem.titleIt ? newsItem.titleIt : newsItem.title;
            const description = lang === 'it' && newsItem.desc_it ? newsItem.desc_it : newsItem.desc;
            
            // Use enhanced location detection with special rules
            const location = window.NewsSystemUtils.LocationMatcher.determineLocation(newsItem);
            
            const soulEffect = newsItem.soul || 0;
            let priceEffect = 1;
            let occupancyEffect = 1;
            
            if (soulEffect > 0) {
                priceEffect = 1 + (soulEffect * 0.02);
                occupancyEffect = 1 + (soulEffect * 0.03);
            } else if (soulEffect < 0) {
                priceEffect = 1 + (soulEffect * 0.02);
                occupancyEffect = 1 + (soulEffect * 0.03);
            }
            
            const news = {
                text: title,
                fullText: description,
                location: location,
                category: 'real',
                type: 'daily',
                timestamp: new Date(),
                priceEffect: priceEffect,
                occupancyEffect: occupancyEffect,
                soulTendencyModifier: soulEffect,
                isRealNews: true,
                isHistorical: false
            };
            
            this.newsHistory.unshift(news);
            if (this.newsHistory.length > 100) {
                this.newsHistory.pop();
            }
            
            this.applyNewsEffects(news, 168); // 1 week duration
            
            if (SceneManager._scene instanceof Scene_Map) {
                this.showNewsNotification(title);
            }
        }
        
        showNewsNotification(title) {
            $gameMessage.setBackground(1);
            $gameMessage.setPositionType(0);
            $gameMessage.add(`\\c[6]===== ${t('breakingNews')} =====\\c[0]`);
            $gameMessage.add(title);
        }
        
        generateInitialProceduralNews() {
            
            const now = new Date();
            const currentYear = now.getFullYear();
            const january1st = new Date(currentYear, 0, 1);
            
            // Calculate how many weeks have passed since January 1st
            const msInWeek = 7 * 24 * 60 * 60 * 1000;
            const weeksSinceJanuary = Math.floor((now - january1st) / msInWeek);
            const maxProceduralNews = Math.min(weeksSinceJanuary * 4, 50); // Max 4 per week, cap at 50
            
            
            for (let i = 0; i < maxProceduralNews; i++) {
                // Generate random timestamp between January 1st and now
                const randomTime = january1st.getTime() + Math.random() * (now.getTime() - january1st.getTime());
                const timestamp = new Date(randomTime);
                
                const locations = window.NewsSystemUtils.getLocations();
                const location = locations[Math.floor(Math.random() * locations.length)];
                const eventCategory = this.selectEventCategory();
                const eventType = this.selectEventType(eventCategory);
                const event = News[eventCategory][eventType];
                
                if (!event) {
                    console.warn('NewsManager: Could not find event for category:', eventCategory, 'type:', eventType);
                    continue;
                }
                
                let newsText = this.generateNewsText(event, location, eventType);
                
                const news = {
                    text: newsText,
                    location: location,
                    category: eventCategory,
                    type: eventType,
                    timestamp: timestamp,
                    priceEffect: event.priceEffect,
                    occupancyEffect: event.occupancyEffect,
                    isRealNews: false,
                    isHistorical: true
                };
                
                this.newsHistory.push(news);
                
                // Apply effects only if the news is recent (within last week)
                const hoursElapsed = (now - timestamp) / 3600000;
                if (hoursElapsed <= 168) { // Within last week
                    const hoursRemaining = event.duration - hoursElapsed;
                    if (hoursRemaining > 0) {
                        this.applyNewsEffects(news, hoursRemaining);
                    }
                }
            }
            
            // Sort all news by timestamp after adding both real and procedural news
            this.newsHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
        }
        
        generatePastRealNews() {
            if (!RealNews || !Array.isArray(RealNews)) {
                console.log('NewsManager: No RealNews data available for past news generation');
                return;
            }
            
            
            const now = new Date();
            const currentYear = now.getFullYear();
            const january1st = new Date(currentYear, 0, 1); // January 1st of current year
            
            let addedCount = 0;
            
            // Create array of past news with proper timestamps
            const pastNewsItems = [];
            
            RealNews.forEach(newsItem => {
                // Parse the original date
                const [day, month, originalYear] = newsItem.date.split('/').map(num => parseInt(num, 10));
                
                // Create date for current year only
                const currentYearDate = new Date(currentYear, month - 1, day);
                
                // Check if current year date is since January 1st and not in the future
                if (currentYearDate >= january1st && currentYearDate <= now) {
                    // Create timestamp with proper time
                    let timestamp;
                    if (newsItem.time) {
                        const [hours, minutes] = newsItem.time.split(':').map(num => parseInt(num, 10));
                        timestamp = new Date(currentYearDate.getFullYear(), currentYearDate.getMonth(), currentYearDate.getDate(), hours, minutes, 0);
                    } else {
                        timestamp = new Date(currentYearDate.getFullYear(), currentYearDate.getMonth(), currentYearDate.getDate(), 8, 0, 0);
                    }
                    
                    pastNewsItems.push({
                        newsItem: newsItem,
                        timestamp: timestamp
                    });
                }
            });
            
            // Sort by timestamp (chronological order)
            pastNewsItems.sort((a, b) => a.timestamp - b.timestamp);
            
            // Add news items in chronological order
            pastNewsItems.forEach(({ newsItem, timestamp }) => {
                const lang = window.NewsSystemUtils.isItalian() ? 'it' : 'en';
                const title = lang === 'it' && newsItem.titleIt ? newsItem.titleIt : newsItem.title;
                const description = lang === 'it' && newsItem.desc_it ? newsItem.desc_it : newsItem.desc;
                
                let location;
                if (newsItem.city && newsItem.city.trim() !== '') {
                    location = newsItem.city;
                } else {
                    const locations = window.NewsSystemUtils.getLocations();
                    location = locations[Math.floor(Math.random() * locations.length)];
                }
                
                const soulEffect = newsItem.soul || 0;
                let priceEffect = 1;
                let occupancyEffect = 1;
                
                if (soulEffect !== 0) {
                    priceEffect = 1 + (soulEffect * 0.02);
                    occupancyEffect = 1 + (soulEffect * 0.03);
                }
                
                const news = {
                    text: title,
                    fullText: description,
                    location: location,
                    category: 'real',
                    type: 'daily',
                    timestamp: timestamp,
                    priceEffect: priceEffect,
                    occupancyEffect: occupancyEffect,
                    soulTendencyModifier: soulEffect,
                    isRealNews: true,
                    isHistorical: true,
                    scheduledTime: newsItem.time || null
                };
                
                this.newsHistory.push(news);
                this.usedRealNewsIds.add(newsItem.title);
                addedCount++;
                
                // Apply effects if still within duration (1 week from event date)
                const hoursElapsed = (now - timestamp) / 3600000;
                const hoursRemaining = 168 - hoursElapsed; // 1 week duration
                if (hoursRemaining > 0) {
                    this.applyNewsEffects(news, hoursRemaining);
                }
                
            });
            
        }
        
        startHourlyUpdates() {
            setInterval(() => {
                const now = new Date();
                if (now.getHours() !== this.currentHour) {
                    this.currentHour = now.getHours();
                    this.processHourlyUpdate();
                }
                
                // Check for timed news every minute
                this.processTimedNews();
                
                if (this.shouldProcessDailyNews()) {
                    this.processDailyNews();
                }
            }, 60000); // Check every minute for more precise timing
        }
        
        processHourlyUpdate() {
            this.activeEffects = this.activeEffects.filter(effect => {
                effect.remainingHours--;
                return effect.remainingHours > 0;
            });
            
            if (Math.random() < 0.3) {
                this.generateNewsEvent();
            }
            
            if (SceneManager._scene instanceof Scene_Map && this.newsHistory.length > 0) {
                const recentNews = this.newsHistory.filter(news => {
                    const newsTime = new Date(news.timestamp);
                    const now = new Date();
                    return (now - newsTime) < 3600000;
                });
                
                if (recentNews.length > 0) {
                    $gameMessage.setBackground(1);
                    $gameMessage.setPositionType(0);
                    $gameMessage.add(`\\c[6]===== ${t('breakingNews')} =====\\c[0]`);
                    recentNews.forEach(news => {
                        $gameMessage.add(news.text);
                    });
                }
            }
            
            this.save();
        }
        
        generateNewsEvent() {
            const locations = window.NewsSystemUtils.getLocations();
            const location = locations[Math.floor(Math.random() * locations.length)];
            const eventCategory = this.selectEventCategory();
            const eventType = this.selectEventType(eventCategory);
            const event = News[eventCategory][eventType];
            
            let newsText = this.generateNewsText(event, location, eventType);
            
            const news = {
                text: newsText,
                location: location,
                category: eventCategory,
                type: eventType,
                timestamp: new Date(),
                priceEffect: event.priceEffect,
                occupancyEffect: event.occupancyEffect,
                isRealNews: false
            };
            
            this.newsHistory.unshift(news);
            if (this.newsHistory.length > 50) {
                this.newsHistory.pop();
            }
            
            this.applyNewsEffects(news, event.duration);
        }
        
        selectEventCategory() {
            const rand = Math.random();
            if (rand < 0.35) return 'positive';
            if (rand < 0.60) return 'negative';
            if (rand < 0.75) return 'neutral';
            return 'surreal';
        }
        
        selectEventType(category) {
            const types = Object.keys(News[category]);
            return types[Math.floor(Math.random() * types.length)];
        }
        
        generateNewsText(event, location, eventType) {
            const lang = window.NewsSystemUtils.isItalian() ? 'it' : 'en';
            const templates = event.templates[lang];
            let text = templates[Math.floor(Math.random() * templates.length)];
            
            text = text.replace(/{location}/g, location);
            
            // Handle all the specific replacements
            if (text.includes('{festival}') && event.festivals) {
                const festival = event.festivals[lang][Math.floor(Math.random() * event.festivals[lang].length)];
                text = text.replace(/{festival}/g, festival);
            }
            
            if (text.includes('{discovery}') && event.discoveries) {
                const discovery = event.discoveries[lang][Math.floor(Math.random() * event.discoveries[lang].length)];
                text = text.replace(/{discovery}/g, discovery);
            }
            
            if (text.includes('{disaster}') && event.disasters) {
                const disaster = event.disasters[lang][Math.floor(Math.random() * event.disasters[lang].length)];
                text = text.replace(/{disaster}/g, disaster);
            }
            
            if (text.includes('{celebrity}') && event.celebrities) {
                const celebrity = event.celebrities[lang][Math.floor(Math.random() * event.celebrities[lang].length)];
                text = text.replace(/{celebrity}/g, celebrity);
            }
            
            if (text.includes('{phenomenon}') && event.phenomenon) {
                const phenomenon = event.phenomenon[lang][Math.floor(Math.random() * event.phenomenon[lang].length)];
                text = text.replace(/{phenomenon}/g, phenomenon);
            }
            
            if (text.includes('{color}') && event.colors) {
                const color = event.colors[lang][Math.floor(Math.random() * event.colors[lang].length)];
                text = text.replace(/{color}/g, color);
            }
            
            if (text.includes('{food}') && event.foods) {
                const food = event.foods[lang][Math.floor(Math.random() * event.foods[lang].length)];
                text = text.replace(/{food}/g, food);
            }
            
            if (text.includes('{action}') && event.actions) {
                const action = event.actions[lang][Math.floor(Math.random() * event.actions[lang].length)];
                text = text.replace(/{action}/g, action);
            }
            
            if (text.includes('{animal}') && event.animals) {
                const animal = event.animals[lang][Math.floor(Math.random() * event.animals[lang].length)];
                text = text.replace(/{animal}/g, animal);
            }
            
            if (text.includes('{amount}')) {
                const amount = Math.floor(Math.random() * 450) + 50;
                text = text.replace(/{amount}/g, amount);
            }
            
            if (text.includes('{number}')) {
                if (text.includes(window.NewsSystemUtils.isItalian() ? 'licenziamenti' : 'layoffs')) {
                    const number = (Math.floor(Math.random() * 9) + 1) * 100;
                    text = text.replace(/{number}/, number);
                } else if (text.includes(window.NewsSystemUtils.isItalian() ? 'paperelle' : 'ducks')) {
                    const number = Math.floor(Math.random() * 9000) + 1000;
                    text = text.replace(/{number}/, number);
                } else {
                    const number = Math.floor(Math.random() * 100) + 1;
                    text = text.replace(/{number}/g, number);
                }
            }
            
            if (text.includes('{rank}')) {
                const rank = Math.floor(Math.random() * 10) + 1;
                text = text.replace(/{rank}/g, '#' + rank);
            }
            
            return text;
        }
        
        applyNewsEffects(news, duration) {
            const effect = {
                newsId: news.timestamp,
                location: news.location,
                priceEffect: news.priceEffect,
                occupancyEffect: news.occupancyEffect,
                remainingHours: duration,
                category: news.category,
                type: news.type,
                soulTendencyModifier: news.soulTendencyModifier || 0,
                isHistorical: news.isHistorical || false
            };
            
            this.activeEffects.push(effect);
            
            // Notify listeners (like Real Estate plugin)
            this.notifyListeners(news, duration);
            
            // Update soul tendency if applicable
            this.updateSoulTendencyVariable();
        }
        
        getActiveEffectsForLocation(location) {
            return this.activeEffects.filter(effect => effect.location === location);
        }
        
        calculateCombinedSoulTendency() {
            let totalModifier = 0;
            
            this.activeEffects.forEach(effect => {
                const newsItem = this.newsHistory.find(news => news.timestamp === effect.newsId);
                const isHistorical = newsItem && newsItem.isHistorical;
                
                if (!isHistorical) {
                    if (effect.soulTendencyModifier) {
                        totalModifier += effect.soulTendencyModifier;
                    } else if (effect.category && effect.type && News[effect.category] && News[effect.category][effect.type]) {
                        const soulModifier = News[effect.category][effect.type].soulTendencyModifier || 0;
                        totalModifier += soulModifier;
                    }
                }
            });
            
            return totalModifier;
        }
        
        updateSoulTendencyVariable() {
            const totalModifier = this.calculateCombinedSoulTendency();
            const currentValue = $gameVariables.value(53) || 66666;
            
            const percentageChange = totalModifier;
            const newValue = currentValue + (currentValue * percentageChange / 100);
            
            $gameVariables.setValue(53, Math.round(newValue * 100) / 100);
        }
        
        cleanupOldNews() {
            const now = new Date();
            const currentYear = now.getFullYear();
            const january1st = new Date(currentYear, 0, 1);
            
            this.newsHistory = this.newsHistory.filter(news => {
                const newsTime = new Date(news.timestamp);
                return newsTime >= january1st;
            });
            
            this.activeEffects = this.activeEffects.filter(effect => {
                return effect.remainingHours > 0;
            });
            
            if (RealNews && Array.isArray(RealNews)) {
                const validNewsIds = new Set();
                RealNews.forEach(newsItem => {
                    if (this.isDateSinceJanuary1st(newsItem.date)) {
                        validNewsIds.add(newsItem.title);
                    }
                });
                
                this.usedRealNewsIds = new Set([...this.usedRealNewsIds].filter(id => validNewsIds.has(id)));
            }
        }
        
        save() {
            $gameSystem.newsSystemData = {
                newsHistory: this.newsHistory,
                activeEffects: this.activeEffects,
                currentHour: this.currentHour,
                lastDailyNewsCheck: this.lastDailyNewsCheck,
                usedRealNewsIds: Array.from(this.usedRealNewsIds)
            };
        }
        
        load() {
            const data = $gameSystem.newsSystemData;
            if (data) {
                // Check if we need to clear news due to year change
                const shouldClearNews = this.shouldClearNewsForYearChange(data);
                
                if (shouldClearNews) {
                    console.log('NewsManager: Year change detected, clearing old news data');
                    this.newsHistory = [];
                    this.activeEffects = [];
                    this.usedRealNewsIds = new Set();
                    this.lastDailyNewsCheck = null;
                    this.initialize();
                } else {
                    this.newsHistory = data.newsHistory || [];
                    this.activeEffects = data.activeEffects || [];
                    this.currentHour = data.currentHour !== undefined ? data.currentHour : new Date().getHours();
                    this.lastDailyNewsCheck = data.lastDailyNewsCheck ? new Date(data.lastDailyNewsCheck) : null;
                    this.usedRealNewsIds = new Set(data.usedRealNewsIds || []);
                    
                    this.cleanupOldNews();
                    
                    if (this.newsHistory.length === 0) {
                        this.initialize();
                    } else {
                        // Still generate procedural news if we have gaps
                        this.fillProceduralNewsGaps();
                    }
                    
                    if (this.shouldProcessDailyNews()) {
                        this.processDailyNews();
                    }
                }
            } else {
                this.initialize();
            }
        }
        
        shouldClearNewsForYearChange(data) {
            if (!data.lastDailyNewsCheck) return false;
            
            const lastCheckDate = new Date(data.lastDailyNewsCheck);
            const currentDate = new Date();
            
            // If the year has changed, clear the news
            return lastCheckDate.getFullYear() !== currentDate.getFullYear();
        }
        
        fillProceduralNewsGaps() {
            const now = new Date();
            const currentYear = now.getFullYear();
            const january1st = new Date(currentYear, 0, 1);
            
            // Calculate how many weeks have passed and how many procedural news we should have
            const msInWeek = 7 * 24 * 60 * 60 * 1000;
            const weeksSinceJanuary = Math.floor((now - january1st) / msInWeek);
            const expectedProceduralNews = Math.min(weeksSinceJanuary * 4, 50);
            
            // Count existing procedural news
            const existingProceduralNews = this.newsHistory.filter(news => !news.isRealNews).length;
            
            const newsToAdd = Math.max(0, expectedProceduralNews - existingProceduralNews);
                        
            for (let i = 0; i < newsToAdd; i++) {
                // Generate random timestamp between January 1st and now
                const randomTime = january1st.getTime() + Math.random() * (now.getTime() - january1st.getTime());
                const timestamp = new Date(randomTime);
                
                const locations = window.NewsSystemUtils.getLocations();
                const location = locations[Math.floor(Math.random() * locations.length)];
                const eventCategory = this.selectEventCategory();
                const eventType = this.selectEventType(eventCategory);
                const event = News[eventCategory][eventType];
                
                if (!event) {
                    continue;
                }
                
                let newsText = this.generateNewsText(event, location, eventType);
                
                const news = {
                    text: newsText,
                    location: location,
                    category: eventCategory,
                    type: eventType,
                    timestamp: timestamp,
                    priceEffect: event.priceEffect,
                    occupancyEffect: event.occupancyEffect,
                    isRealNews: false,
                    isHistorical: true
                };
                
                this.newsHistory.push(news);
                
                // Apply effects only if the news is recent (within last week)
                const hoursElapsed = (now - timestamp) / 3600000;
                if (hoursElapsed <= 168) { // Within last week
                    const hoursRemaining = event.duration - hoursElapsed;
                    if (hoursRemaining > 0) {
                        this.applyNewsEffects(news, hoursRemaining);
                    }
                }
            }
            
            // Sort all news by timestamp
            this.newsHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }
    }
    
    // Scene_NewsHistory
    class Scene_NewsHistory extends Scene_MenuBase {
        create() {
            super.create();
            this.createMonthHeaderWindow();
            this.createNewsWindow();
            this.createModalWindow();
        }
    
        createMonthHeaderWindow() {
            const rect = this.monthHeaderWindowRect();
            this._monthHeaderWindow = new Window_MonthHeader(rect);
            this.addWindow(this._monthHeaderWindow);
        }
    
        monthHeaderWindowRect() {
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(1, false);
            const wx = 0;
            const wy = this.mainAreaTop();
            return new Rectangle(wx, wy, ww, wh);
        }
    
        createNewsWindow() {
            const rect = this.newsWindowRect();
            this._newsWindow = new Window_NewsDetailed(rect);
            this._newsWindow.setHandler("cancel", this.popScene.bind(this));
            this._newsWindow.setHandler("ok", this.showNewsModal.bind(this));
            this._newsWindow.setHandler("pageup", this.previousMonth.bind(this));
            this._newsWindow.setHandler("pagedown", this.nextMonth.bind(this));
            this._newsWindow.setMonthHeaderWindow(this._monthHeaderWindow);
            this.addWindow(this._newsWindow);
        }
    
        createModalWindow() {
            const rect = this.modalWindowRect();
            this._modalWindow = new Window_NewsModal(rect);
            this._modalWindow.setHandler("cancel", this.hideNewsModal.bind(this));
            this._modalWindow.hide();
            this.addWindow(this._modalWindow);
        }
    
        modalWindowRect() {
            const ww = Math.min(Graphics.boxWidth - 100, 600);
            const wh = Math.min(Graphics.boxHeight - 100, 500);
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = (Graphics.boxHeight - wh) / 2;
            return new Rectangle(wx, wy, ww, wh);
        }
    
        showNewsModal() {
            const newsItem = this._newsWindow.item();
            if (newsItem) {
                this._modalWindow.setNews(newsItem);
                this._modalWindow.show();
                this._modalWindow.activate();
                this._newsWindow.deactivate();
            }
        }
    
        hideNewsModal() {
            this._modalWindow.hide();
            this._modalWindow.deactivate();
            this._newsWindow.activate();
        }
        
        popScene() {
            if ($gameTemp.newsReturnScene) {
                const returnScene = $gameTemp.newsReturnScene;
                $gameTemp.newsReturnScene = null;
                $gameTemp.newsFilterLocation = null;
                
                if (returnScene === 'realEstate') {
                    // Return to real estate scene if available
                    if (window.Scene_RealEstate) {
                        SceneManager.goto(window.Scene_RealEstate);
                    } else {
                        super.popScene();
                    }
                } else {
                    super.popScene();
                }
            } else {
                super.popScene();
            }
        }
        
        newsWindowRect() {
            const monthHeaderRect = this.monthHeaderWindowRect();
            const wx = 0;
            const wy = monthHeaderRect.y + monthHeaderRect.height;
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
        }
    
        previousMonth() {
            if (this._modalWindow.visible) return;
            this._newsWindow.changeMonth(-1);
        }
    
        nextMonth() {
            if (this._modalWindow.visible) return;
            this._newsWindow.changeMonth(1);
        }
    
        start() {
            super.start();
            ensureNewsManager();
            
            $newsManager.updateSoulTendencyVariable();
            
            if ($gameTemp.newsFilterLocation) {
                this._newsWindow.setLocationFilter($gameTemp.newsFilterLocation);
            }
            
            this._newsWindow.activate();
            this._newsWindow.select(0);
        }
    
        update() {
            super.update();
            
            // Handle month navigation with A/D and left/right arrow keys only when modal is not visible
            if (!this._modalWindow.visible && this._newsWindow.active) {
                if (Input.isTriggered('left') || this.isKeyPressed('KeyA')) {
                    this.previousMonth();
                    SoundManager.playCursor();
                } else if (Input.isTriggered('right') || this.isKeyPressed('KeyD')) {
                    this.nextMonth();
                    SoundManager.playCursor();
                }
            }
    
            // Handle right mouse button to close modal
            if (this._modalWindow.visible && TouchInput.isCancelled()) {
                this.hideNewsModal();
            }
        }
    
        isKeyPressed(key) {
            return Input._currentState[key] && !Input._previousState[key];
        }
    }
    // Window_MonthHeader
    class Window_MonthHeader extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._currentMonth = new Date().getMonth();
            this._currentYear = new Date().getFullYear();
            this.refresh();
        }

        setCurrentMonth(month, year) {
            this._currentMonth = month;
            this._currentYear = year;
            this.refresh();
        }

        getCurrentMonth() {
            return this._currentMonth;
        }

        getCurrentYear() {
            return this._currentYear;
        }

        refresh() {
            this.contents.clear();
            this.drawMonthHeader();
        }

        drawMonthHeader() {
            const monthNames = window.NewsSystemUtils.isItalian() ? [
                'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
            ] : [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];

            const monthText = `${monthNames[this._currentMonth]} 2001`;
            const textWidth = this.textWidth(monthText);
            const x = (this.contentsWidth() - textWidth) / 2;
            const y = 0;

            this.changeTextColor(ColorManager.systemColor());
            this.drawText(monthText, x, y, textWidth, 'center');

            // Draw navigation arrows
            const arrowY = y;
            const leftArrowText = '◀';
            const rightArrowText = '▶';
            
            this.changeTextColor(ColorManager.normalColor());
            this.drawText(leftArrowText, 20, arrowY);
            this.drawText(rightArrowText, this.contentsWidth() - 40, arrowY);

            // Draw help text
            const helpText = window.NewsSystemUtils.isItalian() ? 
                'A/D o ←/→: Cambia mese | W/S o ↑/↓: Naviga notizie' : 
                'A/D or ←/→: Change month | W/S or ↑/↓: Navigate news';
            this.changeTextColor(ColorManager.dimColor1());
            const helpWidth = this.textWidth(helpText);
            this.drawText(helpText, (this.contentsWidth() - helpWidth) / 2, y + this.lineHeight());
        }
    }
    
    // Window_NewsDetailed
    class Window_NewsDetailed extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._data = [];
            this._currentMonth = new Date().getMonth();
            this._currentYear = new Date().getFullYear();
            this._monthHeaderWindow = null;
            this.refresh();
            this.select(0);
        }
    
        setMonthHeaderWindow(window) {
            this._monthHeaderWindow = window;
        }
    
        processHandling() {
            if (this.isOpenAndActive()) {
                // Handle month navigation first - don't process other inputs
                if (Input.isTriggered('left') || this.isKeyPressed('KeyA')) {
                    this.changeMonth(-1);
                    SoundManager.playCursor();
                    return;
                } else if (Input.isTriggered('right') || this.isKeyPressed('KeyD')) {
                    this.changeMonth(1);
                    SoundManager.playCursor();
                    return;
                }
                
                // Handle standard navigation
                if (Input.isTriggered('cancel')) {
                    this.processCancel();
                } else if (Input.isTriggered('ok')) {
                    this.processOk();
                }
            }
        }
    
        isKeyPressed(key) {
            return Input._currentState && Input._currentState[key] && 
                   (!Input._previousState || !Input._previousState[key]);
        }
    
        update() {
            super.update();
            
            // Custom handling for W/S keys for news navigation
            if (this.isOpenAndActive()) {
                if (this.isKeyPressed('KeyS')) {
                    this.cursorDown(false);
                    SoundManager.playCursor();
                } else if (this.isKeyPressed('KeyW')) {
                    this.cursorUp(false);
                    SoundManager.playCursor();
                }
            }
        }
    
        cursorDown(wrap) {
            const index = this.index();
            const maxItems = this.maxItems();
            
            if (maxItems > 0 && index < maxItems - 1) {
                this.select(index + 1);
            } else if (wrap && maxItems > 0) {
                this.select(0);
            }
        }
    
        cursorUp(wrap) {
            const index = this.index();
            const maxItems = this.maxItems();
            
            if (maxItems > 0 && index > 0) {
                this.select(index - 1);
            } else if (wrap && maxItems > 0) {
                this.select(maxItems - 1);
            }
        }
    
        changeMonth(direction) {
            const newMonth = this._currentMonth + direction;
            const currentDate = new Date();
            const january = new Date(this._currentYear, 0, 1);
            
            if (newMonth < 0) {
                this._currentMonth = 11;
                this._currentYear--;
                // Don't go before January of current year
                if (this._currentYear < currentDate.getFullYear()) {
                    this._currentYear = currentDate.getFullYear();
                    this._currentMonth = 0;
                }
            } else if (newMonth > 11) {
                this._currentMonth = 0;
                this._currentYear++;
                // Don't go beyond current date
                if (this._currentYear > currentDate.getFullYear()) {
                    this._currentYear = currentDate.getFullYear();
                    this._currentMonth = currentDate.getMonth();
                }
            } else {
                this._currentMonth = newMonth;
                // Don't go beyond current month
                if (this._currentYear === currentDate.getFullYear() && 
                    this._currentMonth > currentDate.getMonth()) {
                    this._currentMonth = currentDate.getMonth();
                }
            }
    
            if (this._monthHeaderWindow) {
                this._monthHeaderWindow.setCurrentMonth(this._currentMonth, this._currentYear);
            }
    
            this.refresh();
            this.select(0);
        }
    
        maxItems() {
            return this._data ? this._data.length : 0;
        }
        
        setLocationFilter(location) {
            this._locationFilter = location;
            this.refresh();
            this.select(0);
        }
        
        item() {
            return this.maxItems() > 0 ? this._data[this.index()] : null;
        }
    
        makeItemList() {
            ensureNewsManager();
            const allNews = $newsManager ? $newsManager.newsHistory : [];
            
            // Filter news by current month and year
            const monthNews = allNews.filter(news => {
                const newsDate = new Date(news.timestamp);
                return newsDate.getMonth() === this._currentMonth && 
                       newsDate.getFullYear() === this._currentYear;
            });
            
            if (this._locationFilter) {
                this._data = monthNews.filter(news => news.location === this._locationFilter);
            } else {
                this._data = monthNews;
            }
            
            // Sort by timestamp (most recent first), but if same day, sort by time
            this._data.sort((a, b) => {
                const dateA = new Date(a.timestamp);
                const dateB = new Date(b.timestamp);
                
                // If same day, sort by actual time
                if (dateA.toDateString() === dateB.toDateString()) {
                    return dateB.getTime() - dateA.getTime(); // Later times first
                }
                
                // Otherwise sort by date
                return dateB - dateA;
            });
        }
    
        drawItem(index) {
            const news = this._data[index];
            if (news) {
                const rect = this.itemLineRect(index);
                const newsDate = new Date(news.timestamp);
                const timeDiff = new Date() - newsDate;
                const hoursAgo = Math.floor(timeDiff / 3600000);
                
                // Format time display
                let timeText;
                if (news.scheduledTime) {
                    // Show scheduled time for real news
                    timeText = news.scheduledTime;
                } else if (hoursAgo === 0) {
                    timeText = t('justNow');
                } else if (hoursAgo < 24) {
                    timeText = `${hoursAgo}${t('hoursAgo')}`;
                } else {
                    timeText = `${Math.floor(hoursAgo / 24)}${t('daysAgo')}`;
                }
                
                this.changeTextColor(ColorManager.systemColor());
                this.drawText(timeText, rect.x, rect.y, 100);
                
                if (news.isRealNews) {
                    this.changeTextColor(ColorManager.textColor(6));
                } else if (news.category === 'positive') {
                    this.changeTextColor(ColorManager.powerUpColor());
                } else if (news.category === 'negative') {
                    this.changeTextColor(ColorManager.deathColor());
                } else if (news.category === 'surreal') {
                    this.changeTextColor(ColorManager.textColor(23));
                } else {
                    this.resetTextColor();
                }
                
                // Only show headline, not full description
                let headlineText = news.text;
                const maxChars = 50; // Increased since we're not showing description
                if (headlineText.length > maxChars) {
                    headlineText = headlineText.substring(0, maxChars) + "...";
                }
                const headlineX = rect.x + 110;
                const headlineWidth = rect.width - 110;
                this.drawText(headlineText, headlineX, rect.y, headlineWidth);
            }
        }
        
        refresh() {
            this.makeItemList();
            super.refresh();
        }
    }
    // New Window_NewsModal class - add this to your plugin
class Window_NewsModal extends Window_Selectable  {
    initialize(rect) {
        super.initialize(rect);
        this._newsItem = null;
        this.createContents();
    }

    setNews(newsItem) {
        this._newsItem = newsItem;
        this.refresh();
    }

    refresh() {
        this.contents.clear();
        if (this._newsItem) {
            this.drawNewsContent();
        }
    }

    drawNewsContent() {
        const newsItem = this._newsItem;
        const padding = 10;
        let y = padding;

        // Draw timestamp
        const newsDate = new Date(newsItem.timestamp);
        const dateString = newsDate.toLocaleDateString().replace(newsDate.getFullYear(), '2001');
        const dateText = dateString + ' ' + (newsItem.scheduledTime || newsDate.toLocaleTimeString());
        this.changeTextColor(ColorManager.textColor(3));
        this.drawText(dateText, padding, y, this.contentsWidth() - padding * 2);
        y += this.lineHeight() + 5;

        // Draw location
        this.changeTextColor(ColorManager.textColor(1));
        this.drawText(newsItem.location, padding, y, this.contentsWidth() - padding * 2);
        y += this.lineHeight() + 15;

        // Draw news content
        if (newsItem.isRealNews) {
            this.changeTextColor(ColorManager.textColor(6));
        } else if (newsItem.category === 'positive') {
            this.changeTextColor(ColorManager.powerUpColor());
        } else if (newsItem.category === 'negative') {
            this.changeTextColor(ColorManager.deathColor());
        } else if (newsItem.category === 'surreal') {
            this.changeTextColor(ColorManager.textColor(23));
        } else {
            this.resetTextColor();
        }

        const contentText = newsItem.fullText || newsItem.text;
        const wrappedText = this.wordWrapText(contentText);
        const lines = wrappedText.split('\n');
        
        for (const line of lines) {
            this.drawText(line, padding, y, this.contentsWidth() - padding * 2);
            y += this.lineHeight();
        }

        // Draw close instruction
        y += 20;
        this.changeTextColor(ColorManager.dimColor1());    }

    wordWrapText(text) {
        if (!text) return "";
        
        const maxLineWidth = this.contentsWidth() - 20; // Account for padding
        const words = text.split(' ');
        let currentLine = '';
        let result = '';

        for (const word of words) {
            const testLine = currentLine.length > 0 ? currentLine + ' ' + word : word;
            if (this.textWidth(testLine) > maxLineWidth && currentLine.length > 0) {
                result += currentLine + '\n';
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        result += currentLine;
        return result;
    }

    processHandling() {
        if (this.isOpenAndActive()) {
            if (Input.isTriggered('cancel') || Input.isTriggered('escape')) {
                this.processCancel();
            }
        }
    }
}


window.NewsSystemUtils.LocationMatcher = {
    // Comprehensive location mapping with variations and translations
    locationVariations: {
        en: {
            // European locations
            'Paris, France': ['paris', 'france', 'french capital', 'city of light'],
            'Rome, Italy': ['rome', 'roma', 'italy', 'italia', 'eternal city', 'italian capital'],
            'Barcelona, Spain': ['barcelona', 'spain', 'catalunya', 'catalonia', 'spanish'],
            'Berlin, Germany': ['berlin', 'germany', 'deutschland', 'german capital'],
            'Amsterdam, Netherlands': ['amsterdam', 'netherlands', 'holland', 'dutch'],
            'Prague, Czech Republic': ['prague', 'praha', 'czech republic', 'czechia'],
            'Vienna, Austria': ['vienna', 'wien', 'austria', 'austrian'],
            'Lisbon, Portugal': ['lisbon', 'lisboa', 'portugal', 'portuguese'],
            'Athens, Greece': ['athens', 'athina', 'greece', 'greek', 'hellenic'],
            'Budapest, Hungary': ['budapest', 'hungary', 'hungarian'],
            'Copenhagen, Denmark': ['copenhagen', 'kobenhavn', 'denmark', 'danish'],
            'Stockholm, Sweden': ['stockholm', 'sweden', 'swedish'],
            'Dublin, Ireland': ['dublin', 'ireland', 'irish'],
            'Brussels, Belgium': ['brussels', 'bruxelles', 'belgium', 'belgian'],
            'Warsaw, Poland': ['warsaw', 'warszawa', 'poland', 'polish'],
            'Zurich, Switzerland': ['zurich', 'schweiz', 'switzerland', 'swiss'],
            'Edinburgh, Scotland': ['edinburgh', 'scotland', 'scottish'],
            'Oslo, Norway': ['oslo', 'norway', 'norwegian'],
            'Helsinki, Finland': ['helsinki', 'finland', 'finnish'],
            'Venice, Italy': ['venice', 'venezia', 'italy', 'italia'],
            'Nice, France': ['nice', 'france', 'french riviera', 'cote d\'azur'],
            'Munich, Germany': ['munich', 'munchen', 'germany', 'bavaria', 'bavarian'],
            'Santorini, Greece': ['santorini', 'greece', 'greek islands', 'cyclades'],
            'Dubrovnik, Croatia': ['dubrovnik', 'croatia', 'croatian', 'adriatic'],
            'Reykjavik, Iceland': ['reykjavik', 'iceland', 'icelandic'],
            'Malta': ['malta', 'maltese', 'valletta'],
            'Luxembourg': ['luxembourg', 'luxembourgish'],
            'Monaco': ['monaco', 'monte carlo', 'monegasque'],
            'Ljubljana, Slovenia': ['ljubljana', 'slovenia', 'slovenian'],
            'Tallinn, Estonia': ['tallinn', 'estonia', 'estonian'],
            
            // Special locations
            'Vatican City': ['vatican', 'vatican city', 'holy see', 'pope', 'papal', 'pontiff', 'bishop of rome', 'catholic church'],
            'New York, USA': ['new york', 'manhattan', 'nyc', 'united nations', 'un headquarters', 'onu', 'big apple'],
            
            // Major world powers (renamed)
            'Washington, USA': ['washington', 'usa', 'united states', 'america', 'american', 'white house', 'pentagon', 'capitol'],
            'Moscow, USSR': ['moscow', 'russia', 'russian', 'ussr', 'soviet union', 'kremlin', 'red square'],
            'London, Britannia': ['london', 'britain', 'british','britannia', 'england', 'uk', 'united kingdom', 'westminster', 'downing street'],
            
            // Asian powers
            'Beijing, China': ['beijing', 'china', 'chinese', 'shanghai', 'hong kong', 'tiananmen', 'forbidden city'],
            'Tokyo, Japan': ['tokyo', 'japan', 'japanese', 'osaka', 'kyoto', 'mount fuji', 'nippon'],
            
            // Middle East
            'Jerusalem, Israel': ['jerusalem', 'israel', 'israeli', 'tel aviv'],
            'Gaza, Palestine': ['haifa', 'gaza', 'west bank'],
            'Tehran, Persia': ['tehran', 'iran', 'iranian', 'persia', 'persian', 'isfahan', 'shiraz'],
            'Baghdad, Iraq': ['baghdad', 'iraq', 'iraqi', 'mesopotamia', 'basra', 'kurdistan'],
            'Damascus, Syria': ['damascus', 'syria', 'syrian', 'aleppo', 'levant'],
            'Riyadh, Saudi Arabia': ['riyadh', 'saudi arabia', 'saudi', 'mecca', 'medina', 'jeddah'],
            'Cairo, Egypt': ['cairo', 'egypt', 'egyptian', 'alexandria', 'nile', 'giza'],
            'Istanbul, Turkey': ['istanbul', 'turkey', 'turkish', 'ankara', 'constantinople', 'bosphorus'],
            'Beirut, Lebanon': ['beirut', 'lebanon', 'lebanese', 'tripoli', 'cedar'],
            'Amman, Jordan': ['amman', 'jordan', 'jordanian', 'petra', 'dead sea'],
            'Kuwait City, Kuwait': ['kuwait', 'kuwaiti', 'kuwait city'],
            'Doha, Qatar': ['doha', 'qatar', 'qatari'],
            'Abu Dhabi, UAE': ['abu dhabi', 'dubai', 'uae', 'emirates', 'emirati'],
            
            // Balkans (under USSR influence)
            'Belgrade, USSR': ['belgrade', 'serbia', 'serbian', 'yugoslavia', 'yugoslav'],
            'Zagreb, USSR': ['zagreb', 'croatia', 'croatian'],
            'Sarajevo, USSR': ['sarajevo', 'bosnia', 'bosnian', 'herzegovina'],
            'Skopje, USSR': ['skopje', 'macedonia', 'macedonian', 'north macedonia'],
            'Pristina, USSR': ['pristina', 'kosovo', 'kosovar'],
            'Podgorica, USSR': ['podgorica', 'montenegro', 'montenegrin'],
            'Tirana, USSR': ['tirana', 'albania', 'albanian'],
            'Sofia, USSR': ['sofia', 'bulgaria', 'bulgarian'],
            'Bucharest, USSR': ['bucharest', 'romania', 'romanian']
        },
        it: {
            // European locations
            'Parigi, Francia': ['parigi', 'francia', 'francese', 'paris', 'france'],
            'Roma, Italia': ['roma', 'italia', 'italiano', 'rome', 'italy'],
            'Barcellona, Spagna': ['barcellona', 'spagna', 'spagnolo', 'barcelona', 'spain', 'catalogna'],
            'Berlino, Germania': ['berlino', 'germania', 'tedesco', 'berlin', 'germany'],
            'Amsterdam, Paesi Bassi': ['amsterdam', 'paesi bassi', 'olanda', 'olandese', 'netherlands'],
            'Praga, Repubblica Ceca': ['praga', 'repubblica ceca', 'ceco', 'prague', 'czech'],
            'Vienna, Austria': ['vienna', 'austria', 'austriaco', 'wien'],
            'Lisbona, Portogallo': ['lisbona', 'portogallo', 'portoghese', 'lisbon', 'portugal'],
            'Atene, Grecia': ['atene', 'grecia', 'greco', 'athens', 'greece'],
            'Budapest, Ungheria': ['budapest', 'ungheria', 'ungherese', 'hungary'],
            'Copenaghen, Danimarca': ['copenaghen', 'danimarca', 'danese', 'copenhagen', 'denmark'],
            'Stoccolma, Svezia': ['stoccolma', 'svezia', 'svedese', 'stockholm', 'sweden'],
            'Dublino, Irlanda': ['dublino', 'irlanda', 'irlandese', 'dublin', 'ireland'],
            'Bruxelles, Belgio': ['bruxelles', 'belgio', 'belga', 'brussels', 'belgium'],
            'Varsavia, Polonia': ['varsavia', 'polonia', 'polacco', 'warsaw', 'poland'],
            'Zurigo, Svizzera': ['zurigo', 'svizzera', 'svizzero', 'zurich', 'switzerland'],
            'Edimburgo, Scozia': ['edimburgo', 'scozia', 'scozzese', 'edinburgh', 'scotland'],
            'Oslo, Norvegia': ['oslo', 'norvegia', 'norvegese', 'norway'],
            'Helsinki, Finlandia': ['helsinki', 'finlandia', 'finlandese', 'finland'],
            'Venezia, Italia': ['venezia', 'italia', 'italiano', 'venice', 'italy'],
            'Nizza, Francia': ['nizza', 'francia', 'francese', 'nice', 'france', 'costa azzurra'],
            'Monaco, Germania': ['monaco di baviera', 'germania', 'tedesco', 'munich', 'baviera'],
            'Santorini, Grecia': ['santorini', 'grecia', 'greco', 'greece', 'cicladi'],
            'Dubrovnik, Croazia': ['dubrovnik', 'croazia', 'croato', 'croatia', 'adriatico'],
            'Reykjavik, Islanda': ['reykjavik', 'islanda', 'islandese', 'iceland'],
            'Malta': ['malta', 'maltese', 'valletta'],
            'Lussemburgo': ['lussemburgo', 'luxembourg'],
            'Monaco': ['monaco', 'monte carlo', 'monegasco'],
            'Lubiana, Slovenia': ['lubiana', 'slovenia', 'sloveno', 'ljubljana'],
            'Tallinn, Estonia': ['tallinn', 'estonia', 'estone', 'estonia'],
            
            // Special locations
            'Città del Vaticano': ['vaticano', 'città del vaticano', 'santa sede', 'papa', 'papale', 'pontefice', 'vescovo di roma', 'chiesa cattolica'],
            'New York, USA': ['new york', 'manhattan', 'nyc', 'nazioni unite', 'sede onu', 'onu', 'grande mela'],
            
            // Major world powers (renamed)
            'Washington, USA': ['washington', 'usa', 'stati uniti', 'america', 'americano', 'casa bianca', 'pentagono', 'campidoglio'],
            'Mosca, URSS': ['mosca', 'russia', 'russo', 'urss', 'unione sovietica', 'cremlino', 'piazza rossa'],
            'Londra, Britannia': ['londra', 'britannia', 'britannico', 'inghilterra', 'regno unito', 'westminster', 'downing street'],
            
            // Asian powers
            'Pechino, Cina': ['pechino', 'cina', 'cinese', 'shanghai', 'hong kong', 'tiananmen', 'città proibita'],
            'Tokyo, Giappone': ['tokyo', 'giappone', 'giapponese', 'osaka', 'kyoto', 'monte fuji', 'nippon'],
            
            // Middle East
            'Gerusalemme, Israele': ['gerusalemme', 'israele', 'israeliano', 'tel aviv'],
            'Gaza, Palestina': ['haifa', 'gaza', 'cisgiordania'],
            'Teheran, Persia': ['teheran', 'iran', 'iraniano', 'persia', 'persiano', 'isfahan', 'shiraz'],
            'Baghdad, Iraq': ['baghdad', 'iraq', 'iracheno', 'mesopotamia', 'basra', 'kurdistan'],
            'Damasco, Siria': ['damasco', 'siria', 'siriano', 'aleppo', 'levante'],
            'Riyadh, Arabia Saudita': ['riyadh', 'arabia saudita', 'saudita', 'mecca', 'medina', 'jeddah'],
            'Il Cairo, Egitto': ['cairo', 'egitto', 'egiziano', 'alessandria', 'nilo', 'giza'],
            'Istanbul, Turchia': ['istanbul', 'turchia', 'turco', 'ankara', 'costantinopoli', 'bosforo'],
            'Beirut, Libano': ['beirut', 'libano', 'libanese', 'tripoli', 'cedro'],
            'Amman, Giordania': ['amman', 'giordania', 'giordano', 'petra', 'mar morto'],
            'Kuwait City, Kuwait': ['kuwait', 'kuwaitiano', 'città del kuwait'],
            'Doha, Qatar': ['doha', 'qatar', 'qatariota'],
            'Abu Dhabi, Emirati': ['abu dhabi', 'dubai', 'emirati arabi uniti', 'emirati', 'emiratino'],
            
            // Balkans (under USSR influence)
            'Belgrado, URSS': ['belgrado', 'serbia', 'serbo', 'jugoslavia', 'jugoslavo'],
            'Zagabria, URSS': ['zagabria', 'croazia', 'croato'],
            'Sarajevo, URSS': ['sarajevo', 'bosnia', 'bosniaco', 'erzegovina'],
            'Skopje, URSS': ['skopje', 'macedonia', 'macedone', 'macedonia del nord'],
            'Pristina, URSS': ['pristina', 'kosovo', 'kosovaro'],
            'Podgorica, URSS': ['podgorica', 'montenegro', 'montenegrino'],
            'Tirana, URSS': ['tirana', 'albania', 'albanese'],
            'Sofia, URSS': ['sofia', 'bulgaria', 'bulgaro'],
            'Bucarest, URSS': ['bucarest', 'romania', 'rumeno']
        }
    },

    // Special priority rules for specific types of news
    specialLocationRules: {
        priority: [
            // Pope-related news always goes to Vatican unless specifically mentioned elsewhere
            {
                keywords: ['pope', 'papa', 'pontiff', 'pontefice', 'papal', 'papale', 'vatican', 'vaticano', 'holy see', 'santa sede', 'bishop of rome', 'vescovo di roma'],
                defaultLocation: {
                    en: 'Vatican City',
                    it: 'Città del Vaticano'
                },
                checkForOverride: true
            },
            // UN/ONU related news goes to New York
            {
                keywords: ['united nations', 'nazioni unite', 'un headquarters', 'sede onu', 'un general assembly', 'assemblea generale onu', 'security council', 'consiglio di sicurezza'],
                defaultLocation: {
                    en: 'New York, USA',
                    it: 'New York, USA'
                },
                checkForOverride: false
            }
        ]
    },

    // Enhanced location detection with special rules
    detectLocationFromText: function(title, description) {
        const lang = window.NewsSystemUtils.isItalian() ? 'it' : 'en';
        const fullText = ((title || '') + ' ' + (description || '')).toLowerCase();
        
        // Remove common punctuation and normalize text
        const normalizedText = fullText.replace(/[.,!?;:"'()[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
        
        // Check special priority rules first
        for (const rule of this.specialLocationRules.priority) {
            const hasKeyword = rule.keywords.some(keyword => 
                new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i').test(normalizedText)
            );
            
            if (hasKeyword) {
                if (rule.checkForOverride) {
                    // For pope news, check if another location is mentioned
                    const otherLocation = this.findNonDefaultLocation(normalizedText, rule.defaultLocation[lang], lang);
                    if (otherLocation) {
                        return otherLocation;
                    }
                }
                return rule.defaultLocation[lang];
            }
        }
        
        // Normal location detection
        const variations = this.locationVariations[lang];
        let bestMatch = null;
        let bestScore = 0;
        
        // Check each location and its variations
        for (const [location, variants] of Object.entries(variations)) {
            let score = 0;
            
            for (const variant of variants) {
                // Exact word match gets highest score
                const regex = new RegExp(`\\b${variant.toLowerCase()}\\b`, 'i');
                if (regex.test(normalizedText)) {
                    score += variant.length * 2; // Longer matches get more weight
                }
                // Partial match gets lower score
                else if (normalizedText.includes(variant.toLowerCase())) {
                    score += variant.length;
                }
            }
            
            // Prefer longer location names for ties
            if (score > bestScore || (score === bestScore && location.length > (bestMatch?.length || 0))) {
                bestScore = score;
                bestMatch = location;
            }
        }
        
        // Return match only if we have a reasonable confidence
        return bestScore >= 3 ? bestMatch : null;
    },

    // Helper function to find alternative locations when special rules apply
    findNonDefaultLocation: function(normalizedText, defaultLocation, lang) {
        const variations = this.locationVariations[lang];
        
        for (const [location, variants] of Object.entries(variations)) {
            if (location === defaultLocation) continue; // Skip the default location
            
            for (const variant of variants) {
                const regex = new RegExp(`\\b${variant.toLowerCase()}\\b`, 'i');
                if (regex.test(normalizedText)) {
                    return location;
                }
            }
        }
        
        return null;
    },

    // Function to get random location as fallback
    getRandomLocation: function() {
        const locations = window.NewsSystemUtils.getLocations();
        return locations[Math.floor(Math.random() * locations.length)];
    },

    // Main function to determine location for news item
    determineLocation: function(newsItem) {
        // 1. Check if city is explicitly provided and not empty
        if (newsItem.city && newsItem.city.trim() !== '') {
            return newsItem.city.trim();
        }

        // 2. Try to detect location from title and description
        const title = newsItem.title || newsItem.titleIt || '';
        const description = newsItem.desc || newsItem.desc_it || '';
        
        const detectedLocation = this.detectLocationFromText(title, description);
        if (detectedLocation) {
            console.log(`NewsSystem: Detected location "${detectedLocation}" from text: "${title}"`);
            return detectedLocation;
        }

        // 3. Fallback to random location
        console.log(`NewsSystem: No location detected for "${title}", using random location`);
        return this.getRandomLocation();
    }
}

    // Global instance
    let $newsManager = null;
    
    // Export for other plugins
    window.$newsManager = null;
    window.NewsManager = NewsManager;
    
    // Ensure News Manager exists
    function ensureNewsManager() {
        if (!$newsManager) {
            $newsManager = new NewsManager();
            
            // Check if we have saved data first
            const savedData = $gameSystem.newsSystemData;
            if (savedData && savedData.newsHistory && savedData.newsHistory.length > 0) {
                // Load existing data
                $newsManager.load();
            } else {
                // Only initialize if no saved data exists
                $newsManager.initialize();
            }
            
            window.$newsManager = $newsManager;
        }
    }
    
    // Plugin commands
    PluginManager.registerCommand(pluginName, 'checkNewsHistory', args => {
        ensureNewsManager();
        SceneManager.push(Scene_NewsHistory);
    });
    
    PluginManager.registerCommand(pluginName, 'forceNewsEvent', args => {
        ensureNewsManager();
        $newsManager.generateNewsEvent();
        $gameMessage.add(t('newsEventMsg'));
    });
    
    // Save/Load
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        if ($newsManager) {
            $newsManager.save();
        }
        return contents;
    };
    
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        // Don't automatically create and load - wait for ensureNewsManager to be called
        $newsManager = null;
        window.$newsManager = null;
    };
    
    // Export Scene for other plugins
    window.Scene_NewsHistory = Scene_NewsHistory;
    window.Window_MonthHeader = Window_MonthHeader;
    window.Window_NewsModal = Window_NewsModal;
})();