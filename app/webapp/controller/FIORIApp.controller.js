sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.mmd.controller.FIORIApp", {
		onInit: function () {
			// Controller initialization
		},
		
		onSampleQuestionsPress: function () {
			MessageToast.show("Sample questions feature coming soon!");
			// Could navigate to a sample questions page or open a dialog
		},
		
		onHomePress: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteHome");
		},
		
		onOtherArticlesPress: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteHome");
		}
	});
});

