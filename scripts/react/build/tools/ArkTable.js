ArkTable = React.createClass({displayName: "ArkTable",
	getInitialState: function(){
		function getInitialList(length){
			var list = [];
			for(var c=0; c<length; c++)
				list[c] = c;
			return list;
		}
		function getNormalizedContentObj(content, index){
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
			list: getInitialList(this.props.content.length),
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
		var list = this.state.list;
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
		list.sort(get_cmp_function(this.state.normalizedContentObj, this.props.index, this.state.list, this.state.sortOrder));

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
					// if(this.props.index[c2].type){
						/// type modification
					// }

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
				key: c}, 
				columns
				)
				);
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
		var icon = this.props.setting.type=='link'?
			(
				React.createElement("a", {href: this.props.content, target: "_blank"}, 
					React.createElement("div", null, 
						this.props.setting.icon
					)
				)
			):(
				React.createElement("div", null, 
					this.props.setting.icon
				)
			);
		return (
			React.createElement("div", {className: "SpecialCircle"}, 
				icon, 
				React.createElement("div", {className: this.props.setting.type=='text'?'textBlock':''}, this.props.setting.type=='text'? this.props.content : this.props.setting.hover)
			)
			);
	}
});
