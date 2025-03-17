new Vue({
    el: '#app',
    data: {
        newCardTitle: '',
        newCardItems: [
            { text: '' },
            { text: '' },
            { text: '' },
        ],
        firstColumn: [],
        secondColumn: [],
        thirdColumn: [],
        isFirstColumnLocked: false
    },
    methods: {
        updateCardStatus(index, column) {
            const card = this[column][index];
            const completedCount = card.items.filter(item => item.completed).length;
            const totalItems = card.items.length;

            if (column === 'firstColumn' && completedCount / totalItems > 0.5) {
                this.moveCard(index, column, 'secondColumn');
            } else if (column === 'secondColumn' && completedCount === totalItems) {
                this.moveCard(index, column, 'thirdColumn');
                card.completedDate = new Date().toLocaleString();
            }

            this.checkFirstColumnLock();
        },
        moveCard(index, fromColumn, toColumn) {
            const card = this[fromColumn].splice(index, 1)[0];
            this[toColumn].push(card);
        },
        checkFirstColumnLock() {
            this.isFirstColumnLocked = this.secondColumn.length >= 5;
        },
        addCard() {
            if (!this.newCardTitle || this.newCardItems.some(item => !item.text)) {
                alert('Заполните название карточки и хотя бы три пункта!');
                return;
            }
    
            const newCard = {
                id: Date.now(),
                title: this.newCardTitle,
                items: this.newCardItems.map(item => ({ text: item.text, completed: false }))
            };
    
            if (this.firstColumn.length < 3) {
                this.firstColumn.push(newCard);
            } else {
                alert('Первый столбец заполнен! Максимум 3 карточки.');
                return;
            }
    
            this.newCardTitle = '';
            this.newCardItems = [
                { text: '' },
                { text: '' },
                { text: '' }
            ];
        }
    },
    watch: {
        newCardItems: {
            handler(newItems) {
                if (newItems.length < 5 && newItems[newItems.length - 1].text) {
                    this.newCardItems.push({ text: '' });
                }
            },
            deep: true
        }
    }
});