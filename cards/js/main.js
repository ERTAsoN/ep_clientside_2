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
        isFirstColumnLocked: false,
        searchQuery: '',
        modalActive: false,
    },
    methods: {
        updateCardStatus(index, column) {
            const card = this[column][index];
            const completedCount = card.items.filter(item => item.completed).length;
            const totalItems = card.items.length;

            if (column === 'firstColumn' && completedCount / totalItems > 0.5) {
                if (this.secondColumn.length >= 5) {
                    this.isFirstColumnLocked = true;
                    alert('Освободите второй столбец!');
                } else {
                    this.moveCard(index, column, 'secondColumn');
                }
            } else if (column === 'secondColumn' && completedCount === totalItems) {
                this.moveCard(index, column, 'thirdColumn');
                card.completedDate = new Date().toLocaleString();
                this.isFirstColumnLocked = false;
            } else if (column === 'secondColumn' && completedCount / totalItems <= 0.5 && !this.isFirstColumnLocked) {
                this.moveCard(index, column, 'firstColumn');
            }

            this.checkFirstColumnLock();
            this.saveDataToLocalStorage();
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

            if (this.isFirstColumnLocked) {
                alert('Освободите второй столбец!');
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
                items: filledItems.map(item => ({ text: item.text, completed: false }))
            };

            if (this.firstColumn.length >= 3) {
                alert('Первый столбец заполнен! Максимум 3 карточки.');
                return;
            }

            this.firstColumn.push(newCard);

            this.closeModal();

            this.saveDataToLocalStorage();

            this.newCardTitle = '';
            this.newCardItems = [
                { text: '' },
                { text: '' },
                { text: '' }
            ];
        },
        saveDataToLocalStorage() {
            const data = {
                firstColumn: this.firstColumn,
                secondColumn: this.secondColumn,
                thirdColumn: this.thirdColumn,
                isFirstColumnLocked: this.isFirstColumnLocked,
            };

            localStorage.setItem('boardData', JSON.stringify(data));
        },
        loadDataFromLocalStorage() {
            const storedData = localStorage.getItem('boardData');
            if (storedData) {
                const data = JSON.parse(storedData);
                this.firstColumn = data.firstColumn;
                this.secondColumn = data.secondColumn;
                this.thirdColumn = data.thirdColumn;
                this.isFirstColumnLocked = data.isFirstColumnLocked;
            }
        },
        clearAllData() {
            this.firstColumn = [];
            this.secondColumn = [];
            this.thirdColumn = [];
            this.isFirstColumnLocked = false;
            localStorage.removeItem('boardData');
        },
        openModal() {
            document.getElementById('modal').style.display = 'block';
        },
        closeModal() {
            document.getElementById('modal').style.display = 'none';
        }
    },
    computed: {
        filteredFirstColumn() {
            return this.firstColumn.filter(card => card.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
        },
        filteredSecondColumn() {
            return this.secondColumn.filter(card => card.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
        },
        filteredThirdColumn() {
            return this.thirdColumn.filter(card => card.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
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
    },
    mounted() {
        this.loadDataFromLocalStorage();
        this.closeModal();
    }
});