document.addEventListener('DOMContentLoaded', function() {
	function randomString() {
		var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
		var str = '';
		for (var i = 0; i < 10; i++) {
			str += chars[Math.floor(Math.random() * chars.length)];
		}
		return str;
	}
	function generateTemplate(name, data, basicElement, nameClass) {
		var template = document.getElementById(name).innerHTML;
		var element = document.createElement(basicElement || 'div');
		Mustache.parse(template);
		element.innerHTML = Mustache.render(template, data);
		return element;
	}
	function initSortable(id) {
		var el = document.getElementById(id);
		var sortable = Sortable.create(el, {
			group: 'kanban',
			sort: true
		});
	}
	function Column(name) {
		var self = this;
		this.id = randomString();
		this.name = name;
		this.element = generateTemplate('column-template', { name: this.name, id: this.id }, 'column');
		this.element.querySelector('.column').addEventListener('click', function (event) {
			if (event.target.classList.contains('btn-delete')) {
				self.removeColumn();
			}
			if (event.target.classList.contains('add-card')) {
				var cardName = prompt("Enter the name of the card");
				var cardColor = prompt("Enter the color of the card");
				self.addCard(new Card(cardName, cardColor));
			}
		});
	}
	Column.prototype = {
		addCard: function(card) {
			this.element.querySelector('ul').appendChild(card.element);
		},
		removeColumn: function() {
			this.element.parentNode.removeChild(this.element);
		}
	}
	function Card(description, cardColor) {
		var self = this;
		this.id = randomString();
		this.description = description;
		this.cardColor = cardColor;
		this.element = generateTemplate('card-template', { color: this.cardColor, description: this.description}, 'li');
		this.element.querySelector('.card').addEventListener('click', function (event) {
			event.stopPropagation();
			if (event.target.classList.contains('btn-delete')) {
				self.removeCard();
			}
		});
	}
	Card.prototype = {
		removeCard: function() {
			this.element.parentNode.removeChild(this.element);
		}
	}
	function Board(name) {
		var self = this;
		this.id = randomString();
		this.boardName = name;
		this.element = generateTemplate('board-template', { name: this.boardName }, 'board');
		this.element.querySelector('.board').addEventListener('click', function (event) {
			if (event.target.classList.contains('create-column')) {
				var columnName = prompt("Enter the name of the column");
				self.addColumn(new Column(columnName));
			}
		});
	}
	Board.prototype = {
		addBoard: function() {
			var HTMLbody = document.querySelector('body');
			HTMLbody.appendChild(this.element)
		},
		addColumn: function(column) {
			var HTMLcolumnContainer = this.element.querySelector('.column-container');
			HTMLcolumnContainer.appendChild(column.element);
			initSortable(column.id);
		}
	}
	document.querySelector('.create-board').addEventListener('click', function() {
		var name = prompt('Enter a board name');
		var board = new Board(name);
		board.addBoard();
	});
	// CREATING BOARD
	var kanbanBoard = new Board('Kanban')
	// ADDING BOARD TO PAGE
	kanbanBoard.addBoard();
	// CREATING COLUMNS
	var todoColumn = new Column('To do');
	var doingColumn = new Column('Doing');
	var doneColumn = new Column('Done');

	// ADDING COLUMNS TO THE BOARD
	kanbanBoard.addColumn(todoColumn);
	kanbanBoard.addColumn(doingColumn);
	kanbanBoard.addColumn(doneColumn);

	// CREATING CARDS
	var card1 = new Card('New task');
	var card2 = new Card('Create kanban boards');

	// ADDING CARDS TO COLUMNS
	todoColumn.addCard(card1);
	doingColumn.addCard(card2);
});