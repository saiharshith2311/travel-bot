class FranceTravelBot {
  constructor() {
    // DOM elements
    this.chatMessages = document.getElementById('chatMessages');
    this.userInput = document.getElementById('userInput');
    this.sendButton = document.getElementById('sendButton');
    this.loadingIndicator = document.getElementById('loadingIndicator');
    this.status = document.getElementById('status');
    
    // Core France data - simplified structure but preserving key information
    this.franceData = {
      tourism: {
        visitors: "100+ million international visitors (2024)",
        revenue: "€71 billion in revenue (+12%)",
        ranking: "World's #1 tourist destination"
      },
      destinations: [
        {
          name: "Paris", region: "Île-de-France", visitors: "30+ million annually",
          highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral"],
          bestTime: "April-June, September-October"
        },
        {
          name: "French Riviera", region: "Provence-Alpes-Côte d'Azur",
          highlights: ["Nice", "Cannes", "Monaco"], bestTime: "May-October"
        },
        {
          name: "Loire Valley", region: "Centre-Val de Loire",
          highlights: ["Château de Chambord", "Château de Chenonceau"], 
          bestTime: "April-October"
        }
      ],
      cuisine: {
        dishes: ["Escargot", "Coq au Vin", "Bouillabaisse", "Cassoulet", "Ratatouille"],
        etiquette: ["Always say 'Bonjour'", "Keep hands visible on table", "Wait for 'Bon appétit'"]
      },
      transport: {
        train: "TGV high-speed network connects major cities",
        public: "Paris: €75 monthly Navigo pass for metro/bus"
      },
      seasons: {
        spring: "March-May: 13-20°C, pleasant weather, fewer crowds",
        summer: "June-August: 15-25°C, peak season, highest prices",
        fall: "September-November: 8-15°C, harvest season, good value",
        winter: "December-February: 3-8°C, Christmas markets, lowest prices"
      }
    };
    
    this.init();
  }
  
  init() {
    // Event listeners
    this.sendButton.addEventListener('click', () => this.handleSendMessage());
    this.userInput.addEventListener('keypress', e => { if (e.key === 'Enter') this.handleSendMessage(); });
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        this.userInput.value = e.target.dataset.question;
        this.handleSendMessage();
      });
    });
    
    this.updateStatus('Connected to France Tourism Database');
  }
  
  async handleSendMessage() {
    const message = this.userInput.value.trim();
    if (!message) return;
    
    this.addMessage(message, 'user');
    this.userInput.value = '';
    this.sendButton.disabled = true;
    this.showLoading();
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      const response = this.generateResponse(message);
      this.addMessage(response.text, 'bot', response.source);
    } catch (error) {
      this.addMessage("Je suis désolé, but I'm having trouble accessing the data.", 'bot');
    } finally {
      this.hideLoading();
      this.sendButton.disabled = false;
    }
  }
  
  generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Simple keyword matching for response selection
    if (message.includes('statistic') || message.includes('data'))
      return this.getTourismStatistics();
    if (message.includes('destination') || message.includes('place'))
      return this.getDestinationInfo();
    if (message.includes('paris'))
      return this.getParisInfo();
    if (message.includes('food') || message.includes('cuisine'))
      return this.getCuisineInfo();
    if (message.includes('transport') || message.includes('train'))
      return this.getTransportInfo();
    if (message.includes('time') || message.includes('season'))
      return this.getSeasonInfo();
    
    // Default response
    return {
      text: "I can help with France destinations, cuisine, transport, and travel times. What would you like to know?",
      source: "France Travel Assistant"
    };
  }
  
  // Response generators
  getTourismStatistics() {
    const stats = this.franceData.tourism;
    return {
      text: `🇫🇷 **France Tourism Statistics**\n• Visitors: ${stats.visitors}\n• Revenue: ${stats.revenue}\n• Status: ${stats.ranking}`,
      source: "Official France Tourism Ministry 2024"
    };
  }
  
  getDestinationInfo() {
    let response = "🗺️ **Popular Destinations in France**\n\n";
    this.franceData.destinations.forEach((dest, i) => {
      response += `**${i+1}. ${dest.name}** (${dest.region})\n`;
      response += `• Highlights: ${dest.highlights.join(', ')}\n`;
      response += `• Best time: ${dest.bestTime}\n\n`;
    });
    return {
      text: response,
      source: "France Tourism Board 2024"
    };
  }
  
  getParisInfo() {
    const paris = this.franceData.destinations[0];
    return {
      text: `🗼 **Paris - The City of Light**\n• Visitors: ${paris.visitors}\n• Must-see: ${paris.highlights.join(', ')}\n• Best time: ${paris.bestTime}`,
      source: "Paris Tourism Office 2024"
    };
  }
  
  getCuisineInfo() {
    return {
      text: `🍷 **French Cuisine**\n• Must-try dishes: ${this.franceData.cuisine.dishes.join(', ')}\n• Dining etiquette: ${this.franceData.cuisine.etiquette.join(', ')}`,
      source: "French Culinary Institute"
    };
  }
  
  getTransportInfo() {
    return {
      text: `🚆 **Transportation in France**\n• Trains: ${this.franceData.transport.train}\n• Public transit: ${this.franceData.transport.public}`,
      source: "SNCF Connect 2024"
    };
  }
  
  getSeasonInfo() {
    const seasons = this.franceData.seasons;
    return {
      text: `🌍 **Best Time to Visit France**\n• Spring: ${seasons.spring}\n• Summer: ${seasons.summer}\n• Fall: ${seasons.fall}\n• Winter: ${seasons.winter}`,
      source: "Météo-France Climate Data"
    };
  }
  
  // UI helpers
  addMessage(text, sender, source = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    let content = `<div class="message-content">${this.formatText(text)}`;
    if (source) content += `<div class="data-source">Source: ${source}</div>`;
    content += '</div>';
    
    messageDiv.innerHTML = content;
    this.chatMessages.appendChild(messageDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
  
  formatText(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }
  
  showLoading() {
    this.loadingIndicator.classList.add('show');
    this.updateStatus('Analyzing France tourism data...');
  }
  
  hideLoading() {
    this.loadingIndicator.classList.remove('show');
    this.updateStatus('Ready to help you explore France');
  }
  
  updateStatus(message) {
    this.status.textContent = message;
  }
}

// Initialize the bot
document.addEventListener('DOMContentLoaded', () => new FranceTravelBot());

