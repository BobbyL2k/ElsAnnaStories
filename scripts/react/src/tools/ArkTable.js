ArkTableWithFilter = React.createClass({
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
			<div>
				<ArkTable index={this.props.index} content={this.props.content} list={list} />
				<Toolbar active={this.state.toolbarActive}>
					<Filter filter={this.state.filter}
					onClickMenuName={this.toggleToolbar}
					onCheckBoxChange={this.onCheckBoxChange}/>
				</Toolbar>
			</div>
			);
	}
});

ArkTable = React.createClass({
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
			<table className="ArkTable">
				<ArkTableHead index={this.props.index} highlight={this.state.sortOrder[this.state.sortOrder.length-1].key} onClick={this.setSort} />
				<ArkTableBody list={list} content={this.props.content} index={this.props.index} />
			</table>
			);
	}
});

ArkTableHead = React.createClass({
	render: function(){
		var index = [];
		for(var c=0; c<this.props.index.length; c++){
			if(this.props.index[c].width!=0){
				index[c] = (
					<ArkTableColumn 
					key={c}
					id={c}
					className={(this.props.index[c].sortable?'sortable':'')+' '+(this.props.highlight==c?'sorted':'')}
					colSpan={this.props.index[c].width}
					onClick={this.props.onClick} >
					{this.props.index[c].title}
					</ArkTableColumn>
					);
			}
		}
		return (
			<thead>
				<tr>
					{index}
				</tr>
			</thead>
			);
	}
});

ArkTableColumn = React.createClass({
	onClick: function(){
		this.props.onClick(this.props.id);
	},
	render: function(){
		return (
			<td
			className={this.props.className}
			colSpan={this.props.colSpan}
			onClick={this.onClick} >
			{this.props.children}
			</td>
			);
	}
});

ArkTableBody = React.createClass({
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
									<SpecialCircle key={c3} content={this.props.content[ this.props.list[c] ][this.props.index[c2].SpecialCircle[c3].title]} setting={this.props.index[c2].SpecialCircle[c3]}/>
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
						<td
						key={c2}>
						{content}
						</td>
						);
				}
				rows[c] = (
					<tr
					key={this.props.list[c]}>
					{columns}
					</tr>
					);
			}
		}
		return (
			<tbody>
				{rows}
			</tbody>
			);
	}
});

SpecialCircle = React.createClass({
	render: function(){
		var result = this.props.setting.type=='link'?
			(
			<div className="SpecialCircle">
				<a href={this.props.content} target="_blank">
					<div>
						{this.props.setting.icon}
					</div>
					<div>{this.props.setting.type=='text'? this.props.content : this.props.setting.hover }</div>
				</a>
			</div>
			):(
			<div className="SpecialCircle">
				<div>
					{this.props.setting.icon}
				</div>
				<div className={this.props.setting.type=='text'?'textBlock':''}>{this.props.setting.type=='text'? this.props.content : this.props.setting.hover }</div>
			</div>
			);
		return result;
	}
});

Toolbar = React.createClass({
	render: function(){
		var className = 'toolbar';
		className += this.props.active?' active':'';
		return (
			<div className={className}>
				{this.props.children}
			</div>
			);
	}
});

Panel = React.createClass({
	render: function(){
		return (
			<div className="panel">
				<div className="menu-name" onClick={this.props.onClickMenuName}>
					{this.props.menuName}
				</div>
				<div className="panel overflow-y">
					{this.props.children}
				</div>
			</div>
			);
	}
});

Filter = React.createClass({
	render: function(){
		var checkBoxPanels = [];
		for(var c=0; c<this.props.filter.length; c++){
			if(this.props.filter[c]){
				checkBoxPanels[c] = (
					<CheckBoxPanel
					key={c}
					toReturn={c}
					title={this.props.filter[c].title}
					option={this.props.filter[c].option}
					onCheck={this.props.onCheckBoxChange}/>
					);
			}
		}
		return (
			<Panel menuName="Filter" onClickMenuName={this.props.onClickMenuName}>
				{checkBoxPanels}
			</Panel>
			);
	}
});

CheckBoxPanel = React.createClass({
	onCheck: function(option, value){
		this.props.onCheck(this.props.toReturn, option, value);
	},
	render: function(){
		var activeCheckBoxs = [];
		for(var c=0; c<this.props.option.length; c++){
			activeCheckBoxs[c] = (
				<ActiveCheckBox
				key={c}
				toReturn={c}
				optionName={this.props.option[c].optionName}
				checked={this.props.option[c].checked}
				onCheck={this.onCheck} />
				);
		}
		return (
			<table className="panel">
				<tr className="title">
					<td colSpan="2">{this.props.title}</td>
				</tr>
				{activeCheckBoxs}
			</table>
			);
	}
});

ActiveCheckBox = React.createClass({
	onChange: function(){
		this.props.onCheck(this.props.toReturn,!this.props.checked);
	},
	render: function(){
		return (
            <tr className="option" onClick={this.onChange}>
                <td>{this.props.optionName}</td>
                <td><input type="checkbox" checked={this.props.checked} readOnly/></td>
            </tr>
			);
	}
})

