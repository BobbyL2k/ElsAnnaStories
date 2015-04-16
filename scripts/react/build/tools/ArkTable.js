ArkTableWithFilter = React.createClass({displayName: "ArkTableWithFilter",
	getInitialState: function(){
		var filter = [];
		for(var c=0; c<this.props.index.length; c++){
			if(this.props.index[c].enum){
				filter[c] = {
					title:this.props.index[c].title,
					option:[]
				};
				for(var c2=0; c2<this.props.index[c].enum.length; c2++){
					filter[c].option[c2] = {
						optionName:this.props.index[c].enum[c2],
						checked:true
					}
				}
			}
		}
		return {
			toolbarActive: false,
			filter: filter
		}
	},
	toggleToolbar: function(){
		this.setState({toolbarActive:!this.state.toolbarActive});
	},
	onCheckBoxChange: function(c, c2, checked){
		var filter = this.state.filter;
		filter[c].option[c2].checked = checked;
		// console.log(filter);
		this.setState({filter:filter});
	},
	render: function(){
		function isValid(obj, filter){
			for(var c=0; c<filter.length; c++){
				if(filter[c] && typeof obj[filter[c].title] != 'undefined'){
					if(filter[c].option[obj[filter[c].title]].checked === false){
						// console.log(obj);
						return false;
					}
				}
			}
			return true;
		}
		var list = [];
		// console.log('rendering');
		for(var c=0;c<this.props.content.length; c++){
			if(isValid(this.props.content[c], this.state.filter)){
				list[list.length] = c;
			}
		}
		return (
			React.createElement("div", null, 
				React.createElement(Toolbar, {active: this.state.toolbarActive}, 
					React.createElement(Filter, {filter: this.state.filter, 
					onClickMenuName: this.toggleToolbar, 
					onCheckBoxChange: this.onCheckBoxChange})
				), 
				React.createElement(MobileTopBar, {
					onClickButton: this.toggleToolbar}), 
				React.createElement(ArkTable, {index: this.props.index, content: this.props.content, list: list})
			)
			);
	}
});

MobileTopBar = React.createClass({displayName: "MobileTopBar",
	render: function(){
		return (React.createElement("div", {className: "Mobile TopBar"}, 
				React.createElement("div", {
				className: "button", 
				onTouchStart: this.props.onClickButton})
			));
	}
});

ArkTable = React.createClass({displayName: "ArkTable",
	getInitialState: function(){
		// function getInitialList(length){
		// 	var list = [];
		// 	for(var c=0; c<length; c++)
		// 		list[c] = c;
		// 	return list;
		// }
		function getNormalizedContentObj(content, index){
			console.log('getting getNormalizedContentObj');
			normalizedContentObj = [];
			function normalize(content, type){
				if(typeof content == 'string'){
					if(type == 'date'){
						return content.split('/').reverse().join();
					}else {
						return content.toLowerCase();
					}
				}
				if(typeof content == 'number')
					return content;
			}
			for(var c=0; c<content.length; c++){
				normalizedContentObj[c] = {};
				for(var c2=0; c2<index.length; c2++){
					if(index[c2].sortable && typeof content[c][index[c2].title] != 'undefined'){
						normalizedContentObj[c][index[c2].title] = normalize(content[c][index[c2].title], index[c2].type);
					}
				}
			}
			return normalizedContentObj;
		}
		return {
			sortOrder: [{key:0,revert:false}],
			// list: getInitialList(this.props.content.length),
			normalizedContentObj: getNormalizedContentObj(this.props.content, this.props.index)
		};
	},
	setSort: function(keyToSet){
		function getIndexOfKey(key, order){
			for(var c=0; c<order.length; c++){
				if(order[c].key == key)
					return c;
			}
			return -1;
		}
		var sortOrder = this.state.sortOrder;
		var index = getIndexOfKey(keyToSet, sortOrder);
		if(index == sortOrder.length-1){
			sortOrder[sortOrder.length-1].revert = !sortOrder[sortOrder.length-1].revert;
		}
		else {
			if(index != -1)
				sortOrder.splice(index,1);
			sortOrder[sortOrder.length] = { key:keyToSet, revert:false };
		}
		this.setState({sortOrder:sortOrder});
	},
	render: function() {
		var list = this.props.list;
		function get_cmp_function ( content, index, list, sortOrder ){
			return function (a, b){
				if(typeof content[a][ index[ sortOrder[sortOrder.length-1].key ].title ] == 'undefined')
					return 1;
				if(typeof content[b][ index[ sortOrder[sortOrder.length-1].key ].title ] == 'undefined')
					return -1;
				for(var c=sortOrder.length-1;c>=0;c--){
					if(content[a][ index[ sortOrder[c].key ].title ] < content[b][ index[ sortOrder[c].key ].title ])
						return sortOrder[c].revert?  1 : -1;
					if(content[a][ index[ sortOrder[c].key ].title ] > content[b][ index[ sortOrder[c].key ].title ])
						return sortOrder[c].revert? -1 :  1;
				}
				return 0;
			}
		}
		list.sort(get_cmp_function(this.state.normalizedContentObj, this.props.index, this.props.list, this.state.sortOrder));

		return (
			React.createElement("table", {className: "ArkTable"}, 
				React.createElement(ArkTableHead, {index: this.props.index, highlight: this.state.sortOrder[this.state.sortOrder.length-1].key, onClick: this.setSort}), 
				React.createElement(ArkTableBody, {list: list, content: this.props.content, index: this.props.index})
			)
			);
	}
});

ArkTableHead = React.createClass({displayName: "ArkTableHead",
	render: function(){
		var index = [];
		for(var c=0; c<this.props.index.length; c++){
			if(this.props.index[c].width!=0){
				index[c] = (
					React.createElement(ArkTableColumn, {
					key: c, 
					id: c, 
					className: (this.props.index[c].sortable?'sortable':'')+' '+(this.props.highlight==c?'sorted':''), 
					colSpan: this.props.index[c].width, 
					onClick: this.props.onClick}, 
					this.props.index[c].title
					)
					);
			}
		}
		return (
			React.createElement("thead", null, 
				React.createElement("tr", null, 
					index
				)
			)
			);
	}
});

ArkTableColumn = React.createClass({displayName: "ArkTableColumn",
	onClick: function(){
		this.props.onClick(this.props.id);
	},
	render: function(){
		return (
			React.createElement("td", {
			className: this.props.className, 
			colSpan: this.props.colSpan, 
			onClick: this.onClick}, 
			this.props.children
			)
			);
	}
});

ArkTableBody = React.createClass({displayName: "ArkTableBody",
	render: function(){
		var rows = [];
		for(var c=0; c<this.props.list.length; c++){
			if(this.props.list[c]){
				// console.log(this.props.list[c]);
				var columns = [];
				for(var c2=0; c2<this.props.index.length; c2++){
					var content;

					if(this.props.index[c2].SpecialCircle){
						content = [];
						for(var c3=0; c3<this.props.index[c2].SpecialCircle.length; c3++){
							if(this.props.content[ this.props.list[c] ][this.props.index[c2].SpecialCircle[c3].title])
								content[c3] = (
									React.createElement(SpecialCircle, {key: c3, content: this.props.content[ this.props.list[c] ][this.props.index[c2].SpecialCircle[c3].title], setting: this.props.index[c2].SpecialCircle[c3]})
									);
						}
					}
					else if(this.props.index[c2].enum){
						content = this.props.index[c2].enum[ this.props.content[ this.props.list[c] ][this.props.index[c2].title] ];
					}
					else{
						content = this.props.content[ this.props.list[c] ][this.props.index[c2].title];
					}

					if(content){
						if(this.props.index[c2].modifier && content){
							content =
								ifExistString(this.props.index[c2].modifier.prefix)
								+
								content
								+
								ifExistString(this.props.index[c2].modifier.postfix);
						}
					}
					else{
						content = 'n/a';
					}
					columns[c2] = (
						React.createElement("td", {
						key: c2}, 
						content
						)
						);
				}
				rows[c] = (
					React.createElement("tr", {
					key: this.props.list[c]}, 
					columns
					)
					);
			}
		}
		return (
			React.createElement("tbody", null, 
				rows
			)
			);
	}
});

SpecialCircle = React.createClass({displayName: "SpecialCircle",
	render: function(){
		var content = this.props.content;
		if(this.props.setting.modifier){
			content =
				ifExistString(this.props.setting.modifier.prefix)
				+
				content
				+
				ifExistString(this.props.setting.modifier.postfix);
		}
		var result = this.props.setting.type=='link'?
			(
			React.createElement("div", {className: "SpecialCircle"}, 
				React.createElement("a", {href: content, target: "_blank"}, 
					React.createElement("div", null, 
						this.props.setting.icon
					), 
					React.createElement("div", null, this.props.setting.hover)
				)
			)
			):(
			React.createElement("div", {className: "SpecialCircle"}, 
				React.createElement("div", null, 
					this.props.setting.icon
				), 
				React.createElement("div", {className: this.props.setting.type=='text'?'textBlock':''}, this.props.setting.type=='text'? content : this.props.setting.hover)
			)
			);
		return result;
	}
});

Toolbar = React.createClass({displayName: "Toolbar",
	render: function(){
		var className = 'toolbar';
		className += this.props.active?' active':'';
		return (
			React.createElement("div", {className: className}, 
				this.props.children
			)
			);
	}
});

Panel = React.createClass({displayName: "Panel",
	render: function(){
		return (
			React.createElement("div", {className: "panel"}, 
				React.createElement("div", {
				className: "menu-name", 
				onClick: this.props.onClickMenuName}, 
					this.props.menuName
				), 
				React.createElement("div", {className: "inner-panel overflow-y"}, 
					this.props.children
				)
			)
			);
	}
});

Filter = React.createClass({displayName: "Filter",
	render: function(){
		var checkBoxPanels = [];
		for(var c=0; c<this.props.filter.length; c++){
			if(this.props.filter[c]){
				checkBoxPanels[c] = (
					React.createElement(CheckBoxPanel, {
					key: c, 
					toReturn: c, 
					title: this.props.filter[c].title, 
					option: this.props.filter[c].option, 
					onCheck: this.props.onCheckBoxChange})
					);
			}
		}
		return (
			React.createElement(Panel, {menuName: "Filter", onClickMenuName: this.props.onClickMenuName}, 
				checkBoxPanels
			)
			);
	}
});

CheckBoxPanel = React.createClass({displayName: "CheckBoxPanel",
	onCheck: function(option, value){
		this.props.onCheck(this.props.toReturn, option, value);
	},
	render: function(){
		var activeCheckBoxs = [];
		for(var c=0; c<this.props.option.length; c++){
			activeCheckBoxs[c] = (
				React.createElement(ActiveCheckBox, {
				key: c, 
				toReturn: c, 
				optionName: this.props.option[c].optionName, 
				checked: this.props.option[c].checked, 
				onCheck: this.onCheck})
				);
		}
		return (
			React.createElement("table", {className: "panel"}, 
				React.createElement("tr", {className: "title"}, 
					React.createElement("td", {colSpan: "2"}, this.props.title)
				), 
				activeCheckBoxs
			)
			);
	}
});

ActiveCheckBox = React.createClass({displayName: "ActiveCheckBox",
	onChange: function(){
		this.props.onCheck(this.props.toReturn,!this.props.checked);
	},
	render: function(){
		return (
            React.createElement("tr", {className: "option", onClick: this.onChange}, 
                React.createElement("td", null, this.props.optionName), 
                React.createElement("td", null, React.createElement("input", {type: "checkbox", checked: this.props.checked, readOnly: true}))
            )
			);
	}
})

