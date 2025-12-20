sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.mmd.controller.Home", {
		onInit: function () {
			// Controller initialization
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
