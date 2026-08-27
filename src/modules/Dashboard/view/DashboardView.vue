<template>
  <div class="container-fluid p-0 dashboard-layout">
    <Header />

    <div class="row g-0">
      <div class="col-md-2 d-none d-md-block">
        <Sidebar />
      </div>

      <div class="col-md-10 p-4">

        <div class="row align-items-center p-4 rounded-4 shadow-sm mb-5 hero-card">
          <div class="col-lg-7">
            <span class="badge mb-2 text-dark hero-badge">نظرة عامة</span>
            <h1 class="fw-bold font-serif mb-3 hero-title">مرحباً بك في أروقة المعرفة</h1>
            <p class="text-secondary mb-4 hero-text">
              إدارة أرشيف الكتب والمخطوطات، متابعة استعارة الأعضاء، وتوثيق حركة المعرفة بكل سهولة ودقة ضمن بيئة مصممة بطابع تراثي كلاسيكي فريد.
            </p>
            <div class="d-flex gap-3">
              <div class="bg-white px-3 py-2 rounded shadow-sm border border-secondary border-opacity-25">
                <span class="d-block text-muted small">إجمالي الكتب</span>
                <strong class="text-dark fs-5">1,420</strong>
              </div>
              <div class="bg-white px-3 py-2 rounded shadow-sm border border-secondary border-opacity-25">
                <span class="d-block text-muted small">الرواد النشطون</span>
                <strong class="text-dark fs-5">345</strong>
              </div>
            </div>
          </div>
          <div class="col-lg-5 text-center mt-4 mt-lg-0">
            <div class="p-3 bg-white rounded-4 shadow-sm border hero-image-outer">
              <div class="rounded-4 overflow-hidden shadow-sm border hero-image-inner">
                <img :src="libraryHeroImg" alt="Dar Al-Hikma Library" class="w-100 h-100 object-fit-cover" />
              </div>
            </div>
          </div>
        </div>

        <h3 class="fw-bold font-serif mb-4 section-title">📚 الإصدارات والمخطوطات المختارة</h3>

        <div class="row g-4 mb-4">
          <div class="col-md-4" v-for="book in mockBooks" :key="book.id">
            <div class="card h-100 border-0 shadow-sm rounded-4 p-3 book-card">
              <div class="d-flex gap-3">
                <div class="rounded p-3 text-white d-flex align-items-center justify-content-center book-cover-placeholder">
                  <span class="small text-center">كتاب</span>
                </div>
                <div>
                  <span class="badge bg-light text-dark border mb-1 book-category">{{ book.category }}</span>
                  <h6 class="fw-bold mb-1 book-title">{{ book.title }}</h6>
                  <p class="text-muted small mb-1">{{ book.author }} • {{ book.year }}</p>
                  <span class="text-warning small">★★★★★ <span class="text-dark fw-bold">{{ book.rating }}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import Footer from '../components/Footer.vue'
import libraryHeroImg from '../../../assets/library-hero.webp'

const mockBooks = ref([
  { id: 1, title: 'قواعد العشق الأربعون', author: 'إليف شافاق', year: 2010, category: 'أدب وروايات', rating: 4.9 },
  { id: 2, title: 'مقدمة ابن خلدون', author: 'ابن خلدون', year: 1377, category: 'تاريخ وفلسفة', rating: 5.0 },
  { id: 3, title: 'المنقذ من الضلال', author: 'الإمام الغزالي', year: 1100, category: 'فلسفة إسلامية', rating: 4.8 }
])
</script>

<style scoped>
.dashboard-layout {
  background-color: #fcf9f2;
  min-height: 100vh;
}

.hero-card {
  background-color: #f4ecd8;
  border: 1px solid #e6dbcc;
}

.hero-badge {
  background-color: #d4af37;
}

.hero-title,
.section-title {
  font-family: Georgia, serif;
  color: #2b1b17;
}

.hero-text {
  line-height: 1.8;
}

.hero-image-outer {
  border-color: #d4c5b9 !important;
}

.hero-image-inner {
  border-color: #d4c5b9 !important;
  max-height: 220px;
}

.book-card {
  background-color: #fff;
  border: 1px solid #e6dbcc !important;
}

.book-cover-placeholder {
  width: 75px;
  height: 100px;
  background-color: #2b1b17;
}

.book-category {
  font-size: 10px;
}

.book-title {
  color: #2b1b17;
}
</style>
