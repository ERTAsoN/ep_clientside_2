new Vue({
    el: '#app',
    data: {
        firstColumn: [
            {
                id: 1,
                title: 'Карточка 1',
                items: [
                    { text: 'Задача 1', completed: false },
                    { text: 'Задача 2', completed: false },
                    { text: 'Задача 3', completed: false }
                ]
            }
        ],
        secondColumn: [],
        thirdColumn: []
    }
});