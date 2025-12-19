sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("com.mmd.controller.Books", {
		onInit: function () {
			// Get the OData model
			var oModel = this.getView().getModel();
			var oView = this.getView();
			
			// Create a JSON model for the form
			var oFormModel = new sap.ui.model.json.JSONModel({
				title: "",
				stock: 0
			});
			oView.setModel(oFormModel, "form");
			
			// Load books on init
			this._loadBooks();
		},

		_loadBooks: function () {
			var oTable = this.byId("booksTable");
			if (oTable) {
				var oBinding = oTable.getBinding("items");
				if (oBinding) {
					oBinding.refresh();
				}
			}
		},

		onAddBook: function () {
			var oView = this.getView();
			var oFormModel = oView.getModel("form");
			var oData = oFormModel.getData();
			
			// Validate input
			if (!oData.title || oData.title.trim() === "") {
				MessageToast.show("Please enter a book title");
				return;
			}
			
			if (oData.stock < 0) {
				MessageToast.show("Stock must be a positive number");
				return;
			}

			var oModel = oView.getModel();
			var oBinding = oModel.bindList("/Books");
			
			// Create new entry
			var oContext = oBinding.create({
				title: oData.title,
				stock: parseInt(oData.stock, 10)
			});
			
			oContext.created().then(function () {
				MessageToast.show("Book created successfully");
				// Reset form
				oFormModel.setData({
					title: "",
					stock: 0
				});
				// Refresh table
				this._loadBooks();
			}.bind(this)).catch(function (oError) {
				MessageBox.error("Failed to create book: " + (oError.message || "Unknown error"));
			});
		},

		onDeleteBook: function (oEvent) {
			var oItem = oEvent.getSource().getParent();
			var oContext = oItem.getBindingContext();
			
			if (!oContext) {
				return;
			}

			MessageBox.confirm("Are you sure you want to delete this book?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.YES) {
						oContext.delete("$direct").then(function () {
							MessageToast.show("Book deleted successfully");
							this._loadBooks();
						}.bind(this)).catch(function (oError) {
							MessageBox.error("Failed to delete book: " + oError.message);
						});
					}
				}.bind(this)
			});
		},

		onRefresh: function () {
			this._loadBooks();
			MessageToast.show("Books refreshed");
		}
	});
});

