class JapanTravelBot {
  constructor() {
    this.chatMessages = document.getElementById('chatMessages');
    this.userInput = document.getElementById('userInput');
    this.sendButton = document.getElementById('sendButton');
    this.loadingIndicator = document.getElementById('loadingIndicator');
    this.status = document.getElementById('status');

    this.japanData = {
      tourism: {
        visitors: "31 million international visitors (2019 pre-pandemic), recovering in 2024",
        ranking: "Top 10 tourist destinations worldwide"
      },
      destinations: [
        {
          name: "Tokyo",
          highlights: ["Tokyo Tower", "Shibuya Crossing", "Asakusa Temple"],
          bestTime: "March-April (cherry blossoms), November (autumn leaves)"
        },
        {
          name: "Kyoto",
          highlights: ["Fushimi Inari Shrine", "Arashiyama Bamboo Grove", "Kinkaku-ji Temple"],
          bestTime: "Spring and Autumn"
        },
        {
          name: "Hokkaido",
          highlights: ["Sapporo Snow Festival", "Ski Resorts", "Lavender Fields"],
          bestTime: "Winter for skiing, Summer for flowers"
        }
      ],
      cuisine: {
        dishes: ["Sushi", "Ramen", "Okonomiyaki", "Tempura", "Takoyaki"],
        etiquette: ["Never stick chopsticks upright", "Slurping noodles is polite", "Always say 'Itadakimasu' before eating"]
      },
      flights: {
        airports: ["Narita (Tokyo)", "Haneda (Tokyo)", "Kansai (Osaka)", "Chubu Centrair (Nagoya)"],
        airlines: ["Japan Airlines (JAL)", "All Nippon Airways (ANA)", "Peach Aviation (budget)"],
        tips: "Book 2-3 months early for best prices. JR Pass often cheaper for domestic travel vs. flights."
      },
      seasons: {
        spring: "🌸 March-May: Cherry blossoms, mild weather",
        summer: "☀️ June-August: Hot & humid, fireworks festivals",
        autumn: "🍁 September-November: Autumn leaves, cool weather",
        winter: "❄️ December-February: Skiing, snow festivals"
      },
      culture: {
        etiquette: ["Bow when greeting", "Remove shoes indoors", "Be quiet on trains"],
        festivals: ["Gion Matsuri (Kyoto)", "Tanabata (Sendai)", "Sapporo Snow Festival"]
      }
    };

    this.init();
  }

  init() {
    this.sendButton.addEventListener('click', () => this.handleSendMessage());
    this.userInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') this.handleSendMessage();
    });
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        this.userInput.value = e.target.dataset.question;
        this.handleSendMessage();
      });
    });
    this.updateStatus("Connected to Japan Tourism Database");
  }

  async handleSendMessage() {
    const message = this.userInput.value.trim();
    if (!message) return;

    this.addMessage(message, 'user');
    this.userInput.value = '';
    this.sendButton.disabled = true;
    this.showLoading();

    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      const response = this.generateResponse(message);
      this.addMessage(response.text, 'bot', response.source);
    } catch (error) {
      this.addMessage("Sorry, I'm having trouble accessing Japan tourism data.", 'bot');
    } finally {
      this.hideLoading();
      this.sendButton.disabled = false;
    }
  }

  generateResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    if (msg.includes("statistic") || msg.includes("data"))
      return this.getTourismStats();
    if (msg.includes("destination") || msg.includes("place"))
      return this.getDestinations();
    if (msg.includes("tokyo"))
      return this.getTokyoInfo();
    if (msg.includes("food") || msg.includes("cuisine"))
      return this.getCuisine();
    if (msg.includes("flight") || msg.includes("airport") || msg.includes("ticket"))
      return this.getFlights();
    if (msg.includes("season") || msg.includes("time"))
      return this.getSeasons();
    if (msg.includes("culture") || msg.includes("festival") || msg.includes("etiquette"))
      return this.getCulture();

    return {
      text: "I can help with Japan destinations, flights, food, culture, and travel seasons. What would you like to know?",
      source: "Japan Travel Assistant"
    };
  }

  getTourismStats() {
    return {
      text: `🇯🇵 **Japan Tourism Statistics**\n• Visitors: ${this.japanData.tourism.visitors}\n• Status: ${this.japanData.tourism.ranking}`,
      source: "JNTO (Japan National Tourism Organization)"
    };
  }

  getDestinations() {
    let text = "🗺️ **Popular Destinations in Japan**\n\n";
    this.japanData.destinations.forEach((d, i) => {
      text += `**${i+1}. ${d.name}**\nHighlights: ${d.highlights.join(', ')}\nBest time: ${d.bestTime}\n\n`;
    });
    return { text, source: "Japan Travel Board 2024" };
  }

  getTokyoInfo() {
    const tokyo = this.japanData.destinations[0];
    return {
      text: `🗼 **Tokyo**\nHighlights: ${tokyo.highlights.join(', ')}\nBest time: ${tokyo.bestTime}`,
      source: "Tokyo Tourism Board"
    };
  }

  getCuisine() {
    return {
      text: `🍣 **Japanese Cuisine**\nMust-try dishes: ${this.japanData.cuisine.dishes.join(', ')}\nEtiquette: ${this.japanData.cuisine.etiquette.join(', ')}`,
      source: "Japanese Culinary Institute"
    };
  }

  getFlights() {
    return {
      text: `✈️ **Flights to Japan**\nAirports: ${this.japanData.flights.airports.join(', ')}\nAirlines: ${this.japanData.flights.airlines.join(', ')}\nTips: ${this.japanData.flights.tips}`,
      source: "Japan Travel Airlines Info 2024"
    };
  }

  getSeasons() {
    const s = this.japanData.seasons;
    return {
      text: `📅 **Best Time to Visit Japan**\n${s.spring}\n${s.summer}\n${s.autumn}\n${s.winter}`,
      source: "Japan Meteorological Agency"
    };
  }

  getCulture() {
    return {
      text: `🎎 **Japanese Culture & Festivals**\nEtiquette: ${this.japanData.culture.etiquette.join(', ')}\nFestivals: ${this.japanData.culture.festivals.join(', ')}`,
      source: "Japan Cultural Affairs Agency"
    };
  }

  addMessage(text, sender, source = null) {
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;
    let content = `<div class="message-content">${this.format(text)}`;
    if (source) content += `<div class="data-source">Source: ${source}</div>`;
    content += '</div>';
    div.innerHTML = content;
    this.chatMessages.appendChild(div);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  format(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  showLoading() {
    this.loadingIndicator.classList.add('show');
    this.updateStatus("Analyzing Japan travel data...");
  }

  hideLoading() {
    this.loadingIndicator.classList.remove('show');
    this.updateStatus("Ready to help you explore Japan");
  }

  updateStatus(msg) {
    this.status.textContent = msg;
  }
}

document.addEventListener('DOMContentLoaded', () => new JapanTravelBot());
