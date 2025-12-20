sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.mmd.controller.ABAPDevelopment", {
		onInit: function () {
			// Controller initialization
		},
		
		onHomePress: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteHome");
		},
		
		onOtherArticlesPress: function () {
			// Could navigate to a parent page if needed
			// For now, just go home
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteHome");
		}
	});
});

