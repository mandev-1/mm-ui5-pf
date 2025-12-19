sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Element",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Label",
	"sap/m/Input",
	"sap/m/TextArea",
	"sap/m/library"
], function (Controller, MessageToast, MessageBox, Element, Dialog, Button, Label, Input, TextArea, mobileLibrary) {
	"use strict";

	const ButtonType = mobileLibrary.ButtonType;

	return Controller.extend("com.mmd.controller.App", {
		onInit: function () {
			// Initialize navigation
			// Initialize language model
			var oLanguageModel = new sap.ui.model.json.JSONModel({
				mode: "human" // "human" or "corporate"
			});
			this.getView().setModel(oLanguageModel, "language");
			
			// Make language model available globally so all views can access it
			this.getOwnerComponent().setModel(oLanguageModel, "language");
			
			// Ensure home page is shown by default
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.attachRouteMatched(this._onRouteMatched, this);
			
			// Navigate to home if no hash is present
			if (!window.location.hash || window.location.hash === "#" || window.location.hash === "") {
				this._navigateToPage("home");
			}
		},
		
		_onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			if (sRouteName === "RouteHome") {
				this._navigateToPage("home");
			} else if (sRouteName === "RouteProjects") {
				this._navigateToPage("projects");
			} else if (sRouteName === "RouteTechStack") {
				this._navigateToPage("techstack");
			} else if (sRouteName === "RouteArticles") {
				this._navigateToPage("articles");
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
			this._navigateToPage(sKey);
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
						type: ButtonType.Emphasized,
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

		onLanguageToggle: function () {
			var oLanguageModel = this.getView().getModel("language");
			var sCurrentMode = oLanguageModel.getProperty("/mode");
			var sNewMode = sCurrentMode === "human" ? "corporate" : "human";
			
			oLanguageModel.setProperty("/mode", sNewMode);
			
			// Update component model too
			this.getOwnerComponent().setModel(oLanguageModel, "language");
			
			var sMessage = sNewMode === "human" 
				? "Switched to real human language mode" 
				: "Switched to corporate language mode";
			MessageToast.show(sMessage);
		}
	});
});

