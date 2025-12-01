// ========== 花瓣飘落动画 ==========
class PetalAnimation {
    constructor() {
        this.canvas = document.getElementById('petals');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.petals = [];
        this.petalCount = 20;
        
        this.colors = [
            'rgba(255, 183, 178, 0.5)',
            'rgba(255, 218, 193, 0.5)',
            'rgba(255, 194, 209, 0.5)',
        ];
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.petals = [];
        for (let i = 0; i < this.petalCount; i++) {
            this.petals.push(this.createPetal());
        }
    }
    
    createPetal() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height - this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: Math.random() * 1 + 0.5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 2,
            size: Math.random() * 12 + 8,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            swingAmplitude: Math.random() * 40 + 20,
            swingSpeed: Math.random() * 0.02 + 0.01,
            swingOffset: Math.random() * Math.PI * 2
        };
    }
    
    drawPetal(petal) {
        this.ctx.save();
        this.ctx.translate(petal.x, petal.y);
        this.ctx.rotate((petal.rotation * Math.PI) / 180);
        
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, petal.size, petal.size * 1.5, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = petal.color;
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.petals.forEach((petal, index) => {
            petal.y += petal.vy;
            petal.rotation += petal.rotationSpeed;
            petal.swingOffset += petal.swingSpeed;
            petal.x += Math.sin(petal.swingOffset) * 0.5;
            
            if (petal.y > this.canvas.height + 50) {
                this.petals[index] = this.createPetal();
                this.petals[index].y = -50;
            }
            
            if (petal.x < -50 || petal.x > this.canvas.width + 50) {
                petal.x = Math.random() * this.canvas.width;
            }
            
            this.drawPetal(petal);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ========== 海报轮播功能 ==========
let currentSlideIndex = 0;
let autoSlideInterval;
const SLIDE_INTERVAL = 7000; // 5秒自动切换

// 显示指定索引的幻灯片
function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // 处理索引边界
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }
    
    // 移除所有激活状态
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // 激活当前幻灯片和指示点
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

// 切换幻灯片（+1 或 -1）
function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
    resetAutoSlide();
}

// 跳转到指定幻灯片
function goToSlide(index) {
    showSlide(index);
    resetAutoSlide();
}

// 开始自动播放
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        showSlide(currentSlideIndex + 1);
    }, SLIDE_INTERVAL);
}

// 停止自动播放
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// 重置自动播放
function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// ========== 键盘控制 ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// ========== 鼠标悬停暂停 ==========
const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
    heroSlider.addEventListener('mouseenter', stopAutoSlide);
    heroSlider.addEventListener('mouseleave', startAutoSlide);
}

// ========== 触摸滑动支持（移动端）==========
let touchStartX = 0;
let touchEndX = 0;

heroSlider?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

heroSlider?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 向左滑动，显示下一张
            changeSlide(1);
        } else {
            // 向右滑动，显示上一张
            changeSlide(-1);
        }
    }
}

// ========== 平滑滚动 ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== 页面加载动画 ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    // 初始化花瓣动画
    new PetalAnimation();
    
    // 开始自动轮播
    startAutoSlide();
    
    // 显示第一张幻灯片
    showSlide(0);
    
    console.log('🌸 花时计 | Hanashidokei');
    console.log('💡 提示：将你的海报图片放入 images/ 文件夹');
    console.log('📝 替换 HTML 中的占位符即可显示图片');
    console.log('⏱️  轮播间隔：5秒');
    console.log('🎮 控制方式：');
    console.log('   - 点击左右箭头');
    console.log('   - 点击底部圆点');
    console.log('   - 键盘左右方向键');
    console.log('   - 移动端左右滑动');
});

// ========== 导出全局函数 ==========
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;
