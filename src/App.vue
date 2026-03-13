<template>
  <div class="demo-app" :data-theme="theme">
    <!-- Theme Toggle -->
    <button class="theme-toggle" @click="toggleTheme" :title="theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'">
      {{ theme === 'dark' ? '☀️' : '🌙' }}
    </button>

    <div class="demo-header">
      <h1>Vueti Select v2</h1>
      <p>A modern, feature-rich multi-select component for Vue 3 — with search, grouping, tags, dark mode, and more.</p>
    </div>

    <div class="demo-container">
      <!-- Demo 1: Basic Multi-Select -->
      <section class="demo-section">
        <h2>Basic Multi-Select <span class="badge badge-new">Default</span></h2>
        <p>Classic multi-select with search, grouping, and select-all. Click items or groups to toggle selection.</p>
        <div class="demo-row">
          <div class="demo-col">
            <label>Multi-select with groups</label>
            <VuetiSelect
              ref="basicSelect"
              :items="basicItems"
              placeholder="Choose categories..."
              @change="onBasicChange"
            />
            <div class="selected-output">
              Selected IDs: {{ basicSelectedIds.length > 0 ? basicSelectedIds.join(', ') : 'None' }}
            </div>
          </div>
        </div>
      </section>

      <!-- Demo 2: Tags Mode -->
      <section class="demo-section">
        <h2>Tags Mode <span class="badge badge-new">New</span></h2>
        <p>Displays selected items as removable tags inside the trigger. Great for visual feedback.</p>
        <div class="demo-row">
          <div class="demo-col">
            <label>Colored tags</label>
            <VuetiSelect
              :items="tagItems"
              mode="tags"
              :tag-limit="4"
              placeholder="Select technologies..."
              @change="onTagsChange"
            />
            <div class="selected-output">
              Selected: {{ tagsSelectedIds.length > 0 ? tagsSelectedIds.join(', ') : 'None' }}
            </div>
          </div>
        </div>
      </section>

      <!-- Demo 3: Sizes -->
      <section class="demo-section">
        <h2>Sizes <span class="badge badge-new">New</span></h2>
        <p>Three sizes available: small, medium (default), and large.</p>
        <div class="demo-row">
          <div class="demo-col">
            <label>Small</label>
            <VuetiSelect :items="sizeItems('sm')" size="sm" placeholder="Small select..." />
          </div>
          <div class="demo-col">
            <label>Medium (Default)</label>
            <VuetiSelect :items="sizeItems('md')" placeholder="Medium select..." />
          </div>
          <div class="demo-col">
            <label>Large</label>
            <VuetiSelect :items="sizeItems('lg')" size="lg" placeholder="Large select..." />
          </div>
        </div>
      </section>

      <!-- Demo 4: States -->
      <section class="demo-section">
        <h2>States <span class="badge badge-new">New</span></h2>
        <p>Disabled and error states with validation messages.</p>
        <div class="demo-row">
          <div class="demo-col">
            <label>Disabled</label>
            <VuetiSelect :items="stateItems()" disabled placeholder="Cannot interact..." />
          </div>
          <div class="demo-col">
            <label>Error state</label>
            <VuetiSelect
              :items="stateItems()"
              :error="true"
              error-message="Please select at least one option"
              placeholder="Select something..."
            />
          </div>
        </div>
      </section>

      <!-- Demo 5: Large Dataset -->
      <section class="demo-section">
        <h2>Large Dataset</h2>
        <p>Handles large lists with smooth scrolling. Try searching through 200+ items.</p>
        <div class="demo-row">
          <div class="demo-col">
            <label>Countries ({{ largeItems.length }} items)</label>
            <VuetiSelect
              :items="largeItems"
              mode="tags"
              :tag-limit="5"
              placeholder="Search countries..."
              :max-height="280"
            />
          </div>
        </div>
      </section>

      <!-- Demo 6: No Search / Custom Texts -->
      <section class="demo-section">
        <h2>Customization</h2>
        <p>Disable search, customize placeholder texts, and adjust label limits.</p>
        <div class="demo-row">
          <div class="demo-col">
            <label>No search, label-limit=3</label>
            <VuetiSelect
              :items="customItems()"
              :searchable="false"
              :label-limit="3"
              placeholder="Pick colors..."
              select-all-text="Toggle all"
              not-found-text="Nothing here"
            />
          </div>
          <div class="demo-col">
            <label>With icons & descriptions</label>
            <VuetiSelect
              :items="iconItems"
              placeholder="Choose a fruit..."
              mode="tags"
              :tag-limit="6"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import VuetiSelect from './components/VuetiSelect.vue'

// Theme
const theme = ref('light')
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme.value)
}

// Demo 1: Basic
const basicSelectedIds = ref([])
const basicItems = reactive([
  {
    id: 1,
    name: 'Clothing',
    displayName: 'Clothing',
    itemSelected: false,
    expanded: false,
    subItems: [
      { id: 11, name: 'T-Shirts', displayName: 'T-Shirts', subItemSelected: false },
      { id: 12, name: 'Jackets', displayName: 'Jackets', subItemSelected: false },
      { id: 13, name: 'Shoes', displayName: 'Shoes', subItemSelected: false },
      { id: 14, name: 'Accessories', displayName: 'Accessories', subItemSelected: false },
    ]
  },
  {
    id: 2,
    name: 'Electronics',
    displayName: 'Electronics',
    itemSelected: false,
    expanded: false,
    subItems: [
      { id: 21, name: 'Smartphones', displayName: 'Smartphones', subItemSelected: false },
      { id: 22, name: 'Laptops', displayName: 'Laptops', subItemSelected: false },
      { id: 23, name: 'Tablets', displayName: 'Tablets', subItemSelected: false },
    ]
  },
  { id: 3, name: 'Books', displayName: 'Books', itemSelected: false },
  { id: 4, name: 'Sports', displayName: 'Sports', itemSelected: false },
  {
    id: 5,
    name: 'Food',
    displayName: 'Food',
    itemSelected: false,
    expanded: false,
    subItems: [
      { id: 51, name: 'Fruits', displayName: 'Fruits', subItemSelected: false },
      { id: 52, name: 'Vegetables', displayName: 'Vegetables', subItemSelected: false },
      { id: 53, name: 'Meat', displayName: 'Meat', subItemSelected: false },
      { id: 54, name: 'Dairy', displayName: 'Dairy', subItemSelected: false },
      { id: 55, name: 'Bakery', displayName: 'Bakery', subItemSelected: false },
    ]
  },
  { id: 6, name: 'Toys', displayName: 'Toys', itemSelected: false },
])

function onBasicChange(ids) {
  basicSelectedIds.value = ids
}

// Demo 2: Tags with colors
const tagsSelectedIds = ref([])
const tagItems = reactive([
  { id: 1, name: 'Vue.js', displayName: 'Vue.js', itemSelected: false, _tagColor: '#42b883' },
  { id: 2, name: 'React', displayName: 'React', itemSelected: false, _tagColor: '#61dafb' },
  { id: 3, name: 'Angular', displayName: 'Angular', itemSelected: false, _tagColor: '#dd0031' },
  { id: 4, name: 'Svelte', displayName: 'Svelte', itemSelected: false, _tagColor: '#ff3e00' },
  { id: 5, name: 'TypeScript', displayName: 'TypeScript', itemSelected: false, _tagColor: '#3178c6' },
  { id: 6, name: 'Tailwind CSS', displayName: 'Tailwind CSS', itemSelected: false, _tagColor: '#06b6d4' },
  { id: 7, name: 'Node.js', displayName: 'Node.js', itemSelected: false, _tagColor: '#339933' },
  { id: 8, name: 'Python', displayName: 'Python', itemSelected: false, _tagColor: '#3776ab' },
  { id: 9, name: 'Rust', displayName: 'Rust', itemSelected: false, _tagColor: '#ce422b' },
  { id: 10, name: 'Go', displayName: 'Go', itemSelected: false, _tagColor: '#00add8' },
])

function onTagsChange(ids) {
  tagsSelectedIds.value = ids
}

// Demo 3: Size items factory
function sizeItems(prefix) {
  return reactive([
    { id: `${prefix}1`, name: 'Option A', displayName: 'Option A', itemSelected: false },
    { id: `${prefix}2`, name: 'Option B', displayName: 'Option B', itemSelected: false },
    { id: `${prefix}3`, name: 'Option C', displayName: 'Option C', itemSelected: false },
  ])
}

// Demo 4: State items
function stateItems() {
  return reactive([
    { id: 's1', name: 'Alpha', displayName: 'Alpha', itemSelected: false },
    { id: 's2', name: 'Beta', displayName: 'Beta', itemSelected: false },
    { id: 's3', name: 'Gamma', displayName: 'Gamma', itemSelected: false },
  ])
}

// Demo 5: Large dataset
const countries = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China',
  'Colombia', 'Croatia', 'Czech Republic', 'Denmark', 'Egypt', 'Estonia', 'Finland',
  'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Ireland',
  'Israel', 'Italy', 'Japan', 'Kenya', 'Latvia', 'Lithuania', 'Luxembourg', 'Malaysia',
  'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan',
  'Panama', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania', 'Russia',
  'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
  'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand', 'Turkey',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
  'Venezuela', 'Vietnam', 'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
  'Armenia', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus',
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia', 'Botswana', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Chad', 'Comoros',
  'Congo', 'Costa Rica', 'Cuba', 'Cyprus', 'Djibouti', 'Dominican Republic', 'Ecuador',
  'El Salvador', 'Eritrea', 'Ethiopia', 'Fiji', 'Gabon', 'Gambia', 'Georgia', 'Ghana',
  'Guatemala', 'Guinea', 'Guyana', 'Haiti', 'Honduras', 'Iraq', 'Jamaica', 'Jordan',
  'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon', 'Liberia', 'Libya',
  'Madagascar', 'Malawi', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius',
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Mozambique', 'Myanmar', 'Namibia',
  'Nepal', 'Nicaragua', 'Niger', 'North Macedonia', 'Oman', 'Papua New Guinea',
  'Paraguay', 'Qatar', 'Rwanda', 'Senegal', 'Sierra Leone', 'Somalia', 'Sri Lanka',
  'Sudan', 'Suriname', 'Syria', 'Tanzania', 'Togo', 'Trinidad and Tobago', 'Tunisia',
  'Turkmenistan', 'Uganda', 'Uzbekistan', 'Yemen', 'Zambia', 'Zimbabwe',
]

const largeItems = reactive(
  countries.sort().map((name, i) => ({
    id: i + 1,
    name,
    displayName: name,
    itemSelected: false,
  }))
)

// Demo 6: Custom items
function customItems() {
  return reactive([
    { id: 'c1', name: 'Red', displayName: 'Red', itemSelected: false },
    { id: 'c2', name: 'Blue', displayName: 'Blue', itemSelected: false },
    { id: 'c3', name: 'Green', displayName: 'Green', itemSelected: false },
    { id: 'c4', name: 'Yellow', displayName: 'Yellow', itemSelected: false },
    { id: 'c5', name: 'Purple', displayName: 'Purple', itemSelected: false },
    { id: 'c6', name: 'Orange', displayName: 'Orange', itemSelected: false },
    { id: 'c7', name: 'Pink', displayName: 'Pink', itemSelected: false },
    { id: 'c8', name: 'Teal', displayName: 'Teal', itemSelected: false },
  ])
}

// Icons items
const iconItems = reactive([
  { id: 'f1', name: 'Apple', displayName: 'Apple', itemSelected: false, icon: '🍎', description: 'Sweet & crunchy' },
  { id: 'f2', name: 'Banana', displayName: 'Banana', itemSelected: false, icon: '🍌', description: 'Rich in potassium' },
  { id: 'f3', name: 'Cherry', displayName: 'Cherry', itemSelected: false, icon: '🍒', description: 'Small & tangy' },
  { id: 'f4', name: 'Grape', displayName: 'Grape', itemSelected: false, icon: '🍇', description: 'Perfect for wine' },
  { id: 'f5', name: 'Mango', displayName: 'Mango', itemSelected: false, icon: '🥭', description: 'Tropical king' },
  { id: 'f6', name: 'Peach', displayName: 'Peach', itemSelected: false, icon: '🍑', description: 'Soft & juicy' },
  { id: 'f7', name: 'Pineapple', displayName: 'Pineapple', itemSelected: false, icon: '🍍', description: 'Tropical zing' },
  { id: 'f8', name: 'Strawberry', displayName: 'Strawberry', itemSelected: false, icon: '🍓', description: 'Summer favorite' },
  { id: 'f9', name: 'Watermelon', displayName: 'Watermelon', itemSelected: false, icon: '🍉', description: 'Refreshing' },
  { id: 'f10', name: 'Kiwi', displayName: 'Kiwi', itemSelected: false, icon: '🥝', description: 'Vitamin C boost' },
])
</script>
