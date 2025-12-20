sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.mmd.controller.DataAnalytics", {
		onInit: function () {
			// Controller initialization
		},
		
		onHomePress: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteHome");
		},
		
		onProjectsPress: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteHome");
		}
	});
});
