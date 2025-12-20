sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Element",
	"sap/ui/core/Fragment",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Input",
	"sap/m/TextArea",
	"sap/m/Label"
], function (Controller, MessageToast, MessageBox, Element, Fragment, Device, Dialog, Button, Input, TextArea, Label) {
	"use strict";

	return Controller.extend("com.mmd.controller.App", {
		onInit: function () {
			// Initialize navigation
			// Initialize language model with dark mode
			var oLanguageModel = new sap.ui.model.json.JSONModel({
				mode: "work", // "work" (corporate speak) or "fun" (direct language)
				darkMode: false
			});
			this.getView().setModel(oLanguageModel, "language");
			
			// Make language model available globally so all views can access it
			this.getOwnerComponent().setModel(oLanguageModel, "language");
			
			// Apply initial theme
			this._applyTheme(false);
			
			// Load profile popover fragment
			this.oView = this.getView();
			var that = this;
			this._oPopoverPromise = Fragment.load({
				id: this.oView.getId(),
				name: "com.mmd.view.fragments.ProfileDialog",
				controller: this
			}).then(function(oPopover) {
				that.oView.addDependent(oPopover);
				that._oPopover = oPopover;
				return oPopover;
			});
			
			// Router will handle navigation automatically
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.attachRouteMatched(this._onRouteMatched, this);
		},
		
		_applyTheme: function (bDark) {
			var sTheme = bDark ? "sap_horizon_dark" : "sap_horizon";
			sap.ui.getCore().applyTheme(sTheme);
		},
		
		_onRouteMatched: function (oEvent) {
			// Update selected navigation item based on route
			var sRouteName = oEvent.getParameter("name");
			var sKey;
			
			// Map route names to navigation keys
			var mRouteToKey = {
				"RouteHome": "home",
				"RouteDemo": "demo",
				"RouteBTPApps": "btp-apps",
				"RouteLLMsRAG": "llms-rag",
				"RouteDataAnalytics": "data-analytics",
				"RouteLowLevel": "low-level",
				"RouteNetworking": "networking",
				"RouteDevOps": "devops",
				"RouteCloudNative": "cloud-native",
				"RouteLLMOps": "llmops",
				"RouteStudying42": "42-prague",
				"RouteABAPDevelopment": "abap-development",
				"RouteFIORIApp": "42-fiori-app",
				"RouteCAPBackend": "cap-backend-certification"
			};
			
			sKey = mRouteToKey[sRouteName] || "home";
			
			// Update selected item in navigation
			var oSideNavigation = this.byId("sideNavigation");
			if (oSideNavigation) {
				oSideNavigation.setSelectedKey(sKey);
			}
		},

		onMenuButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		onHomeIconPress: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteHome");
		},

		onAboutPress: function () {
			MessageBox.information("MMD CAP Application\n\nA minimal CAP application with UI5 frontend.");
		},

		onNavigationItemSelect: function (oEvent) {
			var sKey = oEvent.getParameter("item").getKey();
			var oRouter = this.getOwnerComponent().getRouter();
			var sRouteName;
			
			// Map navigation keys to route names
			switch (sKey) {
				case "home":
					sRouteName = "RouteHome";
					break;
				case "demo":
					sRouteName = "RouteDemo";
					break;
				case "btp-apps":
					sRouteName = "RouteBTPApps";
					break;
				case "llms-rag":
					sRouteName = "RouteLLMsRAG";
					break;
				case "data-analytics":
					sRouteName = "RouteDataAnalytics";
					break;
				case "low-level":
					sRouteName = "RouteLowLevel";
					break;
				case "networking":
					sRouteName = "RouteNetworking";
					break;
				case "devops":
					sRouteName = "RouteDevOps";
					break;
				case "cloud-native":
					sRouteName = "RouteCloudNative";
					break;
				case "llmops":
					sRouteName = "RouteLLMOps";
					break;
				case "42-prague":
					sRouteName = "RouteStudying42";
					break;
				case "abap-development":
					sRouteName = "RouteABAPDevelopment";
					break;
				case "42-fiori-app":
					sRouteName = "RouteFIORIApp";
					break;
				case "cap-backend-certification":
					sRouteName = "RouteCAPBackend";
					break;
				default:
					// Try to construct route name from key
					sRouteName = "Route" + sKey.charAt(0).toUpperCase() + sKey.slice(1).replace(/-([a-z])/g, function(g) { return g[1].toUpperCase(); });
			}
			
			if (sRouteName) {
				oRouter.navTo(sRouteName);
				
				// Collapse side navigation on phone after navigation
				var oToolPage = this.byId("toolPage");
				if (oToolPage && Device.system.phone) {
					oToolPage.setSideExpanded(false);
				}
			}
		},


		quickContactPress: function () {
			if (!this.oContactDialog) {
				this.oContactDialog = new Dialog({
					title: "Quick Contact",
					type: "Message",
					content: [
						new Label({
							text: "Name:",
							labelFor: this.getView().getId() + "--contactName",
							required: true
						}),
						new Input({
							id: this.getView().getId() + "--contactName",
							width: "100%",
							placeholder: "Enter your name",
							value: ""
						}),
						new Label({
							text: "LinkedIn:",
							labelFor: this.getView().getId() + "--contactLinkedIn"
						}),
						new Input({
							id: this.getView().getId() + "--contactLinkedIn",
							width: "100%",
							placeholder: "Enter your LinkedIn profile URL",
							value: ""
						}),
						new Label({
							text: "Message:",
							labelFor: this.getView().getId() + "--contactMessage",
							required: true
						}),
						new TextArea({
							id: this.getView().getId() + "--contactMessage",
							width: "100%",
							rows: 5,
							placeholder: "Enter your message",
							value: "",
							growing: true,
							growingMaxLines: 10
						})
					],
					beginButton: new Button({
						type: "Emphasized",
						text: "Send Email",
						icon: "sap-icon://email",
						press: function () {
							var sViewId = this.getView().getId();
							var oNameInput = this.byId("contactName") || Element.getElementById(sViewId + "--contactName");
							var oLinkedInInput = this.byId("contactLinkedIn") || Element.getElementById(sViewId + "--contactLinkedIn");
							var oMessageTextArea = this.byId("contactMessage") || Element.getElementById(sViewId + "--contactMessage");
							
							var sName = oNameInput ? oNameInput.getValue() : "";
							var sLinkedIn = oLinkedInInput ? oLinkedInInput.getValue() : "";
							var sMessage = oMessageTextArea ? oMessageTextArea.getValue() : "";
							
							// Validate required fields
							if (!sName || sName.trim() === "") {
								MessageToast.show("Please enter your name");
								return;
							}
							
							if (!sMessage || sMessage.trim() === "") {
								MessageToast.show("Please enter a message");
								return;
							}
							
							// Build email subject and body
							var sSubject = encodeURIComponent("Contact from " + sName);
							var sBody = encodeURIComponent("Name: " + sName + "\n\n");
							
							if (sLinkedIn && sLinkedIn.trim() !== "") {
								sBody += "LinkedIn: " + sLinkedIn + "\n\n";
							}
							
							sBody += "Message:\n" + sMessage;
							
							// Create mailto link
							var sMailtoLink = "mailto:mmanbusiness1@gmail.com?subject=" + sSubject + "&body=" + sBody;
							
							// Open email client
							window.location.href = sMailtoLink;
							
							MessageToast.show("Opening email client...");
							this.oContactDialog.close();
							
							// Clear form
							if (oNameInput) oNameInput.setValue("");
							if (oLinkedInInput) oLinkedInInput.setValue("");
							if (oMessageTextArea) oMessageTextArea.setValue("");
						}.bind(this)
					}),
					endButton: new Button({
						text: "Cancel",
						press: function () {
							this.oContactDialog.close();
						}.bind(this)
					})
				});

				// to get access to the controller's model
				this.getView().addDependent(this.oContactDialog);
			}

			this.oContactDialog.open();
		},

		onProfilePress: function (oEvent) {
			var oEventSource = oEvent.getSource();
			var oAvatar = this.byId("profileAvatar");
			var bActive = oAvatar ? oAvatar.getActive() : false;
			var that = this;

			if (oAvatar) {
				oAvatar.setActive(!bActive);
			}

			if (bActive) {
				// Close popover if already open
				if (this._oPopover) {
					this._oPopover.close();
				}
			} else {
				// Open popover
				if (this._oPopover) {
					this._oPopover.openBy(oEventSource);
					this._updateMenuItems();
				} else {
					// Wait for popover to load
					this._oPopoverPromise.then(function(oPopover) {
						oPopover.openBy(oEventSource);
						that._updateMenuItems();
					});
				}
			}
		},
		
		onPopoverClose: function () {
			var oAvatar = this.byId("profileAvatar");
			if (oAvatar) {
				oAvatar.setActive(false);
			}
		},
		
		_updateMenuItems: function () {
			var sFragmentId = this.getView().getId();
			var oDarkModeItem = Fragment.byId(sFragmentId, "darkModeListItem");
			var oLanguageModeItem = Fragment.byId(sFragmentId, "languageModeListItem");
			
			if (!oDarkModeItem || !oLanguageModeItem) {
				return;
			}
			
			var oLanguageModel = this.getView().getModel("language");
			var bDarkMode = oLanguageModel ? oLanguageModel.getProperty("/darkMode") : false;
			var sMode = oLanguageModel ? oLanguageModel.getProperty("/mode") : "work";
			
			// Update dark mode list item
			oDarkModeItem.setIcon(bDarkMode ? "sap-icon://light-mode" : "sap-icon://dark-mode");
			oDarkModeItem.setTitle(bDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode");
			
			// Update language mode list item
			var sLanguageIcon = sMode === "work" 
				? "sap-icon://palette" 
				: "sap-icon://business-objects-experience";
			var sLanguageTitle = sMode === "work" 
				? "Switch to Fun Mode (weekend)" 
				: "Switch to Work Mode";
			
			oLanguageModeItem.setIcon(sLanguageIcon);
			oLanguageModeItem.setTitle(sLanguageTitle);
		},
		
		onDarkModePress: function (oEvent) {
			var oLanguageModel = this.getView().getModel("language");
			var bCurrentDark = oLanguageModel.getProperty("/darkMode");
			var bNewDark = !bCurrentDark;
			
			oLanguageModel.setProperty("/darkMode", bNewDark);
			
			// Update component model
			this.getOwnerComponent().setModel(oLanguageModel, "language");
			
			// Apply theme
			this._applyTheme(bNewDark);
			
			// Update menu items
			this._updateMenuItems();
			
			// Close popover
			if (this._oPopover) {
				this._oPopover.close();
			}
			
			MessageToast.show(bNewDark ? "Dark mode enabled" : "Light mode enabled");
		},
		
		onLanguageModePress: function (oEvent) {
			var oLanguageModel = this.getView().getModel("language");
			var sCurrentMode = oLanguageModel.getProperty("/mode");
			
			// Toggle between work (corporate speak) and fun (direct language)
			var sNewMode = sCurrentMode === "work" ? "fun" : "work";
			
			oLanguageModel.setProperty("/mode", sNewMode);
			
			// Update component model
			this.getOwnerComponent().setModel(oLanguageModel, "language");
			
			// Update menu items
			this._updateMenuItems();
			
			// Close popover
			if (this._oPopover) {
				this._oPopover.close();
			}
			
			var sMessage = sNewMode === "work" 
				? "Switched to work mode (corporate speak)" 
				: "Switched to fun mode (direct language)";
			MessageToast.show(sMessage);
		}
	});
});

