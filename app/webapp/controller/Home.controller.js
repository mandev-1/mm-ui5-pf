sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.mmd.controller.Home", {
		onInit: function () {
			// Controller initialization
		},
		
		onLanguageToggle: function (oEvent) {
			var bState = oEvent.getParameter("state");
			var oLanguageModel = this.getView().getModel("language");
			if (!oLanguageModel) {
				oLanguageModel = this.getOwnerComponent().getModel("language");
			}
			
			if (oLanguageModel) {
				var sNewMode = bState ? "corporate" : "human";
				oLanguageModel.setProperty("/mode", sNewMode);
				
				// Update component model too
				this.getOwnerComponent().setModel(oLanguageModel, "language");
				
				var sMessage = sNewMode === "human" 
					? "Switched to real language mode" 
					: "Switched to corporate language mode";
				MessageToast.show(sMessage);
			}
		},
		
		onViewProjects: function () {
			// Navigate to projects page
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteProjects");
		},
		
		onConnectProfessionally: function () {
			// Open LinkedIn or contact dialog
			MessageToast.show("Opening professional connection...");
			// You can add actual LinkedIn link or contact dialog here
			window.open("https://www.linkedin.com", "_blank");
		}
	});
});
