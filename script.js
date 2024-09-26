document.addEventListener('DOMContentLoaded', () => {
    // Load from localStorage
    function loadList() {
        let needList = JSON.parse(localStorage.getItem('needList')) || [];
        let haveList = JSON.parse(localStorage.getItem('haveList')) || [];
        updateList(document.querySelector('#need-list'), needList);
        updateList(document.querySelector('#have-list'), haveList);
        updateProgress();
    }

    // Update List Function
    function updateList(ulElement, items) {
        ulElement.innerHTML = '';
        items.forEach((item, index) => {
            let li = document.createElement('li');
            li.innerHTML = `${item.quantity} x ${item.name} (${item.category}) <a href="#" class="remove">Remove</a>`;
            li.dataset.index = index; // Store the item index in the list item
            ulElement.appendChild(li);
        });
    }

    // Add new item to Need or Have list
    document.querySelector('#shopping-form').addEventListener('click', function(event) {
        if (event.target.id === 'addNeed' || event.target.id === 'addHave') {
            event.preventDefault();
            let itemName = document.querySelector('#item-input').value.trim();
            let itemQuantity = document.querySelector('#quantity-input').value;
            let itemCategory = document.querySelector('#category-input').value;
            if (itemName === "") return;

            let isNeed = event.target.id === 'addNeed';
            let listKey = isNeed ? 'needList' : 'haveList';
            let currentList = JSON.parse(localStorage.getItem(listKey)) || [];

            currentList.push({
                name: itemName,
                quantity: itemQuantity,
                category: itemCategory
            });

            localStorage.setItem(listKey, JSON.stringify(currentList));
            loadList();
            document.querySelector('#item-input').value = '';
            document.querySelector('#quantity-input').value = '1';
        }
    });

    // Remove item
    document.querySelectorAll('ul').forEach(ul => {
        ul.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove')) {
                let listId = ul.id;
                let listKey = listId === 'need-list' ? 'needList' : 'haveList';
                let currentList = JSON.parse(localStorage.getItem(listKey)) || [];
                let itemIndex = Array.from(ul.children).indexOf(event.target.closest('li'));

                currentList.splice(itemIndex, 1);
                localStorage.setItem(listKey, JSON.stringify(currentList));
                loadList();
            }
        });
    });

    // Move item from Need to Have
    document.querySelector('#need-list').addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            let needList = JSON.parse(localStorage.getItem('needList')) || [];
            let haveList = JSON.parse(localStorage.getItem('haveList')) || [];
            let itemIndex = Array.from(document.querySelector('#need-list').children).indexOf(event.target);

            // Move the clicked item to the Have list
            let movedItem = needList.splice(itemIndex, 1)[0];
            haveList.push(movedItem);

            // Update localStorage
            localStorage.setItem('needList', JSON.stringify(needList));
            localStorage.setItem('haveList', JSON.stringify(haveList));

            // Reload lists and progress
            loadList();
        }
    });

    // Update progress bar
    function updateProgress() {
        let needCount = document.querySelector('#need-list').children.length;
        let haveCount = document.querySelector('#have-list').children.length;
        let total = needCount + haveCount;
        let percent = total === 0 ? 0 : (haveCount / total) * 100;
        document.querySelector('#progress-filled').style.width = percent + '%';
    }

    // Initialize
    loadList();
});
