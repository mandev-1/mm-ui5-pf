sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Element",
	"sap/ui/core/Fragment"
], function (Controller, MessageToast, MessageBox, Element, Fragment) {
	"use strict";

	return Controller.extend("com.mmd.controller.App", {
		onInit: function () {
			// Initialize navigation
			// Initialize language model with dark mode
			var oLanguageModel = new sap.ui.model.json.JSONModel({
				mode: "corporate", // "corporate" (default) or "weekend"
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
			
			// Ensure home page is shown by default
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.attachRouteMatched(this._onRouteMatched, this);
			
			// Navigate to home if no hash is present
			if (!window.location.hash || window.location.hash === "#" || window.location.hash === "") {
				this._navigateToPage("home");
			}
		},
		
		_applyTheme: function (bDark) {
			var sTheme = bDark ? "sap_horizon_dark" : "sap_horizon";
			sap.ui.getCore().applyTheme(sTheme);
		},
		
		_onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			var sPageId;
			
			switch (sRouteName) {
				case "RouteHome":
					sPageId = "home";
					break;
				case "RouteBTPApps":
					sPageId = "btp-apps";
					break;
				case "RouteLLMsRAG":
					sPageId = "llms-rag";
					break;
				case "RouteDataAnalytics":
					sPageId = "data-analytics";
					break;
				case "RouteLowLevel":
					sPageId = "low-level";
					break;
				case "RouteNetworking":
					sPageId = "networking";
					break;
				case "RouteDevOps":
					sPageId = "devops";
					break;
				case "RouteCloudNative":
					sPageId = "cloud-native";
					break;
				case "RouteLLMOps":
					sPageId = "llmops";
					break;
				case "RouteStudying42":
					sPageId = "42-prague";
					break;
				default:
					sPageId = "home";
			}
			
			if (sPageId) {
				this._navigateToPage(sPageId);
			}
		},

		onMenuButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		onHomeIconPress: function () {
			this._navigateToPage("home");
		},

		onAboutPress: function () {
			MessageBox.information("MMD CAP Application\n\nA minimal CAP application with UI5 frontend.");
		},

		onNavigationItemSelect: function (oEvent) {
			var sKey = oEvent.getParameter("item").getKey();
			var oRouter = this.getOwnerComponent().getRouter();
			
			// Map navigation keys to route names
			var sRouteName = "Route" + sKey.charAt(0).toUpperCase() + sKey.slice(1).replace(/-([a-z])/g, function(g) { return g[1].toUpperCase(); });
			
			// Handle special cases
			if (sKey === "42-prague") {
				sRouteName = "RouteStudying42";
			} else if (sKey === "btp-apps") {
				sRouteName = "RouteBTPApps";
			} else if (sKey === "llms-rag") {
				sRouteName = "RouteLLMsRAG";
			} else if (sKey === "data-analytics") {
				sRouteName = "RouteDataAnalytics";
			} else if (sKey === "low-level") {
				sRouteName = "RouteLowLevel";
			} else if (sKey === "cloud-native") {
				sRouteName = "RouteCloudNative";
			} else if (sKey === "llmops") {
				sRouteName = "RouteLLMOps";
			} else if (sKey === "home") {
				sRouteName = "RouteHome";
			}
			
			if (sRouteName) {
				oRouter.navTo(sRouteName);
			}
		},

		_navigateToPage: function (sPageId) {
			var oNavContainer = this.byId("pageContainer");
			var oPage = this.byId(sPageId);
			
			if (oPage && oNavContainer) {
				oNavContainer.to(oPage);
			}
			
			// Update selected item in navigation
			var oSideNavigation = this.byId("sideNavigation");
			if (oSideNavigation) {
				oSideNavigation.setSelectedKey(sPageId);
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
							labelFor: "contactName",
							required: true
						}),
						new Input("contactName", {
							width: "100%",
							placeholder: "Enter your name",
							value: ""
						}),
						new Label({
							text: "LinkedIn:",
							labelFor: "contactLinkedIn"
						}),
						new Input("contactLinkedIn", {
							width: "100%",
							placeholder: "Enter your LinkedIn profile URL",
							value: ""
						}),
						new Label({
							text: "Message:",
							labelFor: "contactMessage",
							required: true
						}),
						new TextArea("contactMessage", {
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
							var sName = Element.getElementById("contactName").getValue(),
								sLinkedIn = Element.getElementById("contactLinkedIn").getValue(),
								sMessage = Element.getElementById("contactMessage").getValue();
							
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
							Element.getElementById("contactName").setValue("");
							Element.getElementById("contactLinkedIn").setValue("");
							Element.getElementById("contactMessage").setValue("");
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
			var sMode = oLanguageModel ? oLanguageModel.getProperty("/mode") : "corporate";
			
			// Update dark mode list item
			oDarkModeItem.setIcon(bDarkMode ? "sap-icon://light-mode" : "sap-icon://dark-mode");
			oDarkModeItem.setTitle(bDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode");
			
			// Update language mode list item
			var sLanguageIcon = sMode === "corporate" 
				? "sap-icon://weekend" 
				: sMode === "weekend"
				? "sap-icon://business-objects-experience"
				: "sap-icon://employee";
			var sLanguageTitle = sMode === "corporate" 
				? "Switch to Weekend Mode" 
				: sMode === "weekend"
				? "Switch to Corporate Mode"
				: "Switch to Corporate Mode";
			
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
			
			// Toggle between corporate (default) and weekend
			var sNewMode = sCurrentMode === "corporate" ? "weekend" : "corporate";
			
			oLanguageModel.setProperty("/mode", sNewMode);
			
			// Update component model
			this.getOwnerComponent().setModel(oLanguageModel, "language");
			
			// Update menu items
			this._updateMenuItems();
			
			// Close popover
			if (this._oPopover) {
				this._oPopover.close();
			}
			
			var sMessage = sNewMode === "corporate" 
				? "Switched to corporate mode" 
				: "Switched to weekend mode";
			MessageToast.show(sMessage);
		}
	});
});

