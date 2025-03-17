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
                if (this.secondColumn.length >= 5) {
                    this.isFirstColumnLocked = true;
                    alert("Освободите второй столбец!");
                } else {
                    this.moveCard(index, column, 'secondColumn');
                }
            } else if (column === 'secondColumn' && completedCount === totalItems) {
                this.moveCard(index, column, 'thirdColumn');
                card.completedDate = new Date().toLocaleString();
                this.isFirstColumnLocked = false;
            }

            this.checkFirstColumnLock();
        },
        moveCard(index, fromColumn, toColumn) {
            const card = this[fromColumn].splice(index, 1)[0];
            this[toColumn].push(card);
        },
        checkFirstColumnLock() {
            if (this.secondColumn.length < 5) {
                this.isFirstColumnLocked = false;
            }
        },
        addCard() {
            if (!this.newCardTitle) {
                alert('Заполните название карточки!');
                return;
            }

            const filledItems = this.newCardItems.filter(item => item.text);
            if (filledItems.length < 3) {
                alert('Заполните минимум 3 пункта!');
                return;
            }
    
            const newCard = {
                id: Date.now(),
                title: this.newCardTitle,
                items: this.newCardItems.filter(item => item.text).map(item => ({ text: item.text, completed: false }))
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