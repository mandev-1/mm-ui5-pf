sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/CustomListItem",
	"sap/m/VBox",
	"sap/m/HBox",
	"sap/m/Text",
	"sap/m/Label",
	"sap/m/Avatar"
], function (Controller, CustomListItem, VBox, HBox, Text, Label, Avatar) {
	"use strict";

	return Controller.extend("com.mmd.controller.Demo", {
		onInit: function () {
			// Controller initialization
			this._mockResponses = [
				"That's a great question! Let me help you understand this concept better.",
				"I can see you're interested in learning more about this topic. Here's what I think you should know...",
				"Based on what you've asked, I'd recommend considering a few different approaches. First, you might want to...",
				"Interesting point! Let me break this down for you in a way that's easy to understand.",
				"This is a complex topic, but I'll do my best to explain it clearly. The key concepts are...",
				"Great question! There are several ways to approach this. Let me walk you through the most effective method.",
				"I appreciate you asking about this. Here's a comprehensive answer that should help clarify things for you."
			];
			
			// Add welcome message
			this._addWelcomeMessage();
		},
		
		onQueryTextAreaLiveChange: function (oEvent) {
			// Handle text area live change
		},
		
		onGenerateQuery: function (oEvent) {
			var oTextArea = this.byId("queryTextArea") || this.byId("queryTextAreaPhone");
			if (!oTextArea) {
				return;
			}
			
			var sQuery = oTextArea.getValue().trim();
			if (!sQuery) {
				return;
			}
			
			// Clear the text area
			oTextArea.setValue("");
			
			// Add user message
			this._addUserMessage(sQuery);
			
			// Show typing indicator and simulate AI response
			this._showTypingIndicator();
			
			// Simulate typing delay (1-2 seconds)
			var iDelay = 1000 + Math.random() * 1000;
			
			setTimeout(function() {
				this._hideTypingIndicator();
				this._addAIMessage();
			}.bind(this), iDelay);
		},
		
		_addWelcomeMessage: function() {
			var oList = this.byId("chatMessageList");
			if (!oList) {
				return;
			}
			
			var oMessageText = new Text({
				text: "Hi! I'm your AI assistant. How can I help you today?",
				class: "chatMessageText"
			});
			
			var oAIAvatar = new Avatar({
				initials: "AI",
				displaySize: "S",
				displayShape: "Circle",
				backgroundColor: "Accent6",
				class: "chatAvatar"
			});
			
			var oMessageContent = new HBox({
				class: "chatMessageContent chatMessageAI",
				items: [
					oAIAvatar,
					new VBox({
						class: "chatMessageBubble",
						items: [oMessageText]
					})
				]
			});
			
			var oMessageItem = new CustomListItem({
				content: oMessageContent
			});
			
			oList.addItem(oMessageItem);
			this._scrollToBottom();
		},
		
		_addUserMessage: function(sText) {
			var oList = this.byId("chatMessageList");
			if (!oList) {
				return;
			}
			
			var oMessageText = new Text({
				text: sText,
				class: "chatMessageText"
			});
			
			var oUserAvatar = new Avatar({
				initials: "U",
				displaySize: "S",
				displayShape: "Circle",
				backgroundColor: "Accent1",
				class: "chatAvatar"
			});
			
			var oMessageContent = new HBox({
				class: "chatMessageContent chatMessageUser",
				justifyContent: "End",
				items: [
					new VBox({
						class: "chatMessageBubble",
						items: [oMessageText]
					}),
					oUserAvatar
				]
			});
			
			var oMessageItem = new CustomListItem({
				content: oMessageContent
			});
			
			oList.addItem(oMessageItem);
			this._scrollToBottom();
		},
		
		_addAIMessage: function() {
			var oList = this.byId("chatMessageList");
			if (!oList) {
				return;
			}
			
			// Get random mock response
			var sResponse = this._mockResponses[
				Math.floor(Math.random() * this._mockResponses.length)
			];
			
			// Simulate typing effect
			this._showTypingMessage(sResponse);
		},
		
		_showTypingMessage: function(sFullText) {
			var oList = this.byId("chatMessageList");
			if (!oList) {
				return;
			}
			
			var oMessageText = new Text({
				text: "",
				class: "chatMessageText"
			});
			
			var oAIAvatar = new Avatar({
				initials: "AI",
				displaySize: "S",
				displayShape: "Circle",
				backgroundColor: "Accent6",
				class: "chatAvatar"
			});
			
			var oMessageContent = new HBox({
				class: "chatMessageContent chatMessageAI",
				items: [
					oAIAvatar,
					new VBox({
						class: "chatMessageBubble",
						items: [oMessageText]
					})
				]
			});
			
			var oMessageItem = new CustomListItem({
				content: oMessageContent
			});
			
			oList.addItem(oMessageItem);
			
			// Type out the message character by character
			var iIndex = 0;
			var iTypingSpeed = 30 + Math.random() * 20; // 30-50ms per character
			
			var fnTypeNextChar = function() {
				if (iIndex < sFullText.length) {
					oMessageText.setText(sFullText.substring(0, iIndex + 1));
					iIndex++;
					setTimeout(fnTypeNextChar, iTypingSpeed);
					this._scrollToBottom();
				}
			}.bind(this);
			
			fnTypeNextChar();
		},
		
		_showTypingIndicator: function() {
			var oIndicator = this.byId("typingIndicator");
			if (oIndicator) {
				oIndicator.setVisible(true);
				this._scrollToBottom();
			}
		},
		
		_hideTypingIndicator: function() {
			var oIndicator = this.byId("typingIndicator");
			if (oIndicator) {
				oIndicator.setVisible(false);
			}
		},
		
		_scrollToBottom: function() {
			var oScrollContainer = this.byId("chatScrollContainer");
			if (oScrollContainer) {
				// Use setTimeout to ensure DOM is updated
				setTimeout(function() {
					var oDomRef = oScrollContainer.getDomRef();
					if (oDomRef) {
						oDomRef.scrollTop = oDomRef.scrollHeight;
					}
				}, 50);
			}
		}
	});
});

