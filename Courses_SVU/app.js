// البيانات الافتراضية
const defaultProducts = [
    {
        id: 1,
        title: "منتج 1",
        description: "وصف المنتج 1.",
        image: "https://via.placeholder.com/300",
        is_free: true,
        link: "https://example.com/buy-product-1"
    },
    {
        id: 2,
        title: "منتج 2",
        description: "وصف المنتج 2.",
        image: "https://via.placeholder.com/300",
        is_free: false,
        link: "https://example.com/buy-product-2"
    }
];

// تحميل المنتجات من localStorage أو استخدام البيانات الافتراضية
let products = JSON.parse(localStorage.getItem('products')) || defaultProducts;
let isAdmin = false;

// تحميل تفضيل الوضع الداكن
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
}

// حفظ المنتجات في localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// عرض المنتجات
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h2 class="text-xl font-semibold">${product.title}</h2>
                <p class="text-gray-600 dark:text-gray-300 mt-2">${product.description}</p>
                <div class="mt-4 flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        <a href="${product.link}" class="bg-${product.is_free ? 'green' : 'blue'}-500 text-white py-2 px-4 rounded hover:bg-${product.is_free ? 'green' : 'blue'}-600">
                            ${product.is_free ? 'عرض مجاني' : 'شراء'}
                        </a>
                        <span class="text-sm text-gray-500 dark:text-gray-400">${product.is_free ? '(مجاني)' : '(مدفوع)'}</span>
                    </div>
                    ${isAdmin ? `
                        <div class="flex space-x-2">
                            <button onclick="editProduct(${product.id})" class="text-blue-600 hover:underline">تعديل</button>
                            <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:underline">حذف</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// عرض رسالة
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `container mx-auto mt-4 p-4 rounded ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} ${type === 'success' ? 'dark:bg-green-800 dark:text-green-200' : 'dark:bg-red-800 dark:text-red-200'}`;
    messageDiv.classList.remove('hidden');
    setTimeout(() => messageDiv.classList.add('hidden'), 3000);
}

// تحويل الصورة إلى Base64
function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// إدارة الوضع الداكن
const toggleDarkMode = document.getElementById('toggleDarkMode');
toggleDarkMode.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    toggleDarkMode.textContent = theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن';
});

// إدارة تسجيل الدخول
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const userTypeSelect = document.getElementById('userType');
const adminCredentials = document.getElementById('adminCredentials');
const openAddModal = document.getElementById('openAddModal');

userTypeSelect.addEventListener('change', () => {
    adminCredentials.classList.toggle('hidden', userTypeSelect.value !== 'admin');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userType = userTypeSelect.value;
    
    if (userType === 'admin') {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === 'ahmad' && password === '266219') {
            isAdmin = true;
            openAddModal.classList.remove('hidden');
            loginModal.classList.add('hidden');
            displayProducts();
            showMessage('تم تسجيل الدخول كأدمن بنجاح!', 'success');
        } else {
            showMessage('اسم المستخدم أو كلمة المرور غير صحيحة!', 'error');
        }
    } else {
        isAdmin = false;
        openAddModal.classList.add('hidden');
        loginModal.classList.add('hidden');
        displayProducts();
        showMessage('تم تسجيل الدخول كمستخدم عادي!', 'success');
    }
});

// فتح نموذج الإضافة/التعديل (للأدمن فقط)
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');

openAddModal.addEventListener('click', () => {
    if (isAdmin) {
        modalTitle.textContent = 'إضافة منتج جديد';
        productForm.reset();
        document.getElementById('productId').value = '';
        productModal.classList.remove('hidden');
    }
});

closeModal.addEventListener('click', () => {
    productModal.classList.add('hidden');
});

// إضافة/تعديل منتج (للأدمن فقط)
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const productId = document.getElementById('productId').value;
    const imageInput = document.getElementById('image');
    let imageData = '';

    if (imageInput.files && imageInput.files[0]) {
        try {
            imageData = await imageToBase64(imageInput.files[0]);
        } catch (error) {
            showMessage('خطأ في تحميل الصورة!', 'error');
            return;
        }
    } else if (productId) {
        const existingProduct = products.find(p => p.id === parseInt(productId));
        imageData = existingProduct.image;
    } else {
        showMessage('يرجى اختيار صورة!', 'error');
        return;
    }

    const newProduct = {
        id: productId ? parseInt(productId) : products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        image: imageData,
        is_free: document.getElementById('is_free').value === 'true',
        link: document.getElementById('link').value
    };

    if (productId) {
        products = products.map(product => product.id === newProduct.id ? newProduct : product);
        showMessage('تم تحديث المنتج بنجاح!', 'success');
    } else {
        products.push(newProduct);
        showMessage('تم إضافة المنتج بنجاح!', 'success');
    }

    saveProducts();
    displayProducts();
    productModal.classList.add('hidden');
});

// تعديل منتج (للأدمن فقط)
function editProduct(id) {
    if (!isAdmin) return;

    const product = products.find(p => p.id === id);
    if (product) {
        modalTitle.textContent = 'تعديل المنتج';
        document.getElementById('productId').value = product.id;
        document.getElementById('title').value = product.title;
        document.getElementById('description').value = product.description;
        document.getElementById('image').value = '';
        document.getElementById('is_free').value = product.is_free.toString();
        document.getElementById('link').value = product.link;
        productModal.classList.remove('hidden');
    }
}

// حذف منتج (للأدمن فقط)
function deleteProduct(id) {
    if (!isAdmin) return;

    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        products = products.filter(product => product.id !== id);
        saveProducts();
        displayProducts();
        showMessage('تم حذف المنتج بنجاح!', 'success');
    }
}

// عرض المنتجات عند تحميل الصفحة
displayProducts();