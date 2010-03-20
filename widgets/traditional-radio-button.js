Mojo.Widget.TraditionalRadioButton = Class.create({
	setup: function() {
		this.clickHandler = this.clickHandler.bindAsEventListener(this);
		this.controller.listen(this.controller.element, Mojo.Event.tap, this.clickHandler);
		this.valueName = this.controller.attributes.modelProperty || Mojo.Widget.defaultModelProperty;
		this.render();
	},

	cleanup: function() {
		this.controller.stopListening(this.controller.element, Mojo.Event.tap, this.clickHandler);
	},

	handleModelChanged: function() {
		this.render();
	},

	render: function() {
		this.choices = this.controller.model.choices;

		this.listItemsParent = Mojo.Widget.Util.renderListIntoDiv(
		  this.controller.element,
		  this.controller.attributes,
		  "widgets/traditional-radio-button-wrapper",
		  this.choices,
		  "widgets/traditional-radio-button"
		);

		//Apply initial selection
		if(this.controller.model[this.valueName] !== undefined) {
			var children = this.listItemsParent.childElements();

			for(var i = 0; i < children.length; i++){
				var child = children[i];
				if(child._mojoListIndex !== undefined){
					if(this.choices[child._mojoListIndex].value == this.controller.model[this.valueName]) {
						child.addClassName("selected");
						this.currentItem = child;
						break;
					}
				}
			}
		}

		this.hiddenInput = this.controller.element.querySelector('input');
		this.hiddenInput.value = this.controller.model[this.valueName];
		this.hiddenInput.name = this.valueName;
	},

	getClickedItem: function(elem) {
		while(elem !== this.controller.element){
			if(elem.parentNode === this.listItemsParent){
				return elem;
			}
			elem = elem.parentNode;
		}
		return undefined;
	},

	clickHandler: function(e) {
		var clicked = this.getClickedItem(e.target);

		if(clicked === undefined || clicked === this.currentItem) {
			return;
		}

		e.stop();

		if(this.currentItem) {
			this.currentItem.removeClassName("selected");
		}

		clicked.addClassName("selected");

		this.currentItem = clicked;
		this.hiddenInput.value = this.choices[clicked._mojoListIndex].value;
		this.controller.model[this.valueName] = this.choices[clicked._mojoListIndex].value;
		Mojo.Event.send(this.controller.element, Mojo.Event.propertyChange, {
		  property: this.valueName,
			value: this.choices[clicked._mojoListIndex].value,
			model: this.controller.model
		});
	}
});
