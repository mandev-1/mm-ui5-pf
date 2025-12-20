sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.mmd.controller.FIORIApp", {
		onInit: function () {
			MessageToast.show("This is not available right now, due to a scheduled maintenance, lol");
		}
	});
});

