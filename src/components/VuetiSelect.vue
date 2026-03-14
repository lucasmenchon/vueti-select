<template>
  <div
    ref="containerRef"
    class="vueti-select"
    :class="{
      'vueti-select--open': isOpen,
      'vueti-select--disabled': disabled,
      'vueti-select--error': error,
      'vueti-select--sm': size === 'sm',
      'vueti-select--lg': size === 'lg',
    }"
  >
    <!-- Trigger Button -->
    <button
      ref="triggerRef"
      type="button"
      class="vueti-trigger"
      :disabled="disabled"
      :tabindex="disabled ? -1 : 0"
      @click="toggleDropdown"
      @keydown="handleTriggerKeydown"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
    >
      <div class="vueti-trigger__content">
        <!-- Tags Mode -->
        <div v-if="mode === 'tags' && selectedItems.length > 0" class="vueti-tags">
          <TransitionGroup name="vueti-tag">
            <span
              v-for="item in visibleTags"
              :key="item.id"
              class="vueti-tag"
              :style="item._tagColor ? { background: item._tagColor + '20', color: item._tagColor, borderColor: item._tagColor + '40' } : {}"
            >
              <span class="vueti-tag__text">{{ item.name }}</span>
              <button
                type="button"
                class="vueti-tag__remove"
                @click.stop="removeTag(item)"
                tabindex="-1"
                :aria-label="'Remove ' + item.name"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </span>
          </TransitionGroup>
          <span v-if="hiddenTagsCount > 0" class="vueti-tag vueti-tag--more">
            +{{ hiddenTagsCount }}
          </span>
        </div>
        <!-- Default label -->
        <span v-else class="vueti-trigger__label" :class="{ 'vueti-trigger__label--placeholder': selectedItems.length === 0 }">
          {{ triggerLabel }}
        </span>
      </div>
      <div class="vueti-trigger__actions">
        <Transition name="vueti-fade">
          <button
            v-if="clearable && selectedItems.length > 0 && !disabled"
            type="button"
            class="vueti-trigger__clear"
            @click.stop="clearAll"
            tabindex="-1"
            aria-label="Clear all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </button>
        </Transition>
        <span class="vueti-trigger__counter" v-if="selectedItems.length > 0 && mode !== 'tags'">
          {{ selectedItems.length }}
        </span>
        <svg
          class="vueti-trigger__chevron"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </button>

    <!-- Error Message -->
    <Transition name="vueti-slide">
      <span v-if="error && errorMessage" class="vueti-error">{{ errorMessage }}</span>
    </Transition>

    <!-- Dropdown -->
    <Teleport to="body">
      <Transition name="vueti-dropdown">
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="vueti-dropdown"
          :style="dropdownStyle"
          @mousedown.prevent
        >
          <!-- Search -->
          <div v-if="searchable" class="vueti-search">
            <svg class="vueti-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              ref="searchInputRef"
              v-model="searchTerm"
              type="text"
              class="vueti-search__input"
              :placeholder="searchPlaceholder"
              @keydown="handleSearchKeydown"
              autocomplete="off"
              spellcheck="false"
            />
            <Transition name="vueti-fade">
              <button
                v-if="searchTerm"
                type="button"
                class="vueti-search__clear"
                @click="searchTerm = ''"
                tabindex="-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </Transition>
          </div>

          <!-- Toolbar: Select All + Counter -->
          <div class="vueti-toolbar">
            <label class="vueti-check vueti-toolbar__select-all" @click.prevent="toggleSelectAll">
              <input
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                class="vueti-check__input"
              />
              <span class="vueti-check__box">
                <svg v-if="isAllSelected" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <svg v-else-if="isIndeterminate" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </span>
              <span class="vueti-toolbar__label">{{ selectAllText }}</span>
            </label>
            <span class="vueti-toolbar__count">
              <span class="vueti-toolbar__count-num">{{ selectedItems.length }}</span> / {{ totalLeafCount }}
            </span>
          </div>

          <!-- Items List -->
          <div ref="listRef" class="vueti-list" role="listbox" aria-multiselectable="true">
            <div v-if="filteredItems.length === 0" class="vueti-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              <span>{{ emptyText }}</span>
            </div>

            <template v-for="item in filteredItems" :key="item.id">
              <!-- Group Item -->
              <div
                class="vueti-item"
                :class="{
                  'vueti-item--active': highlightedId === item.id,
                  'vueti-item--group': item.subItems && item.subItems.length > 0,
                }"
                @mouseenter="highlightedId = item.id"
                @click="handleItemClick(item)"
                role="option"
                :aria-selected="item.itemSelected"
              >
                <label class="vueti-check" @click.stop.prevent="handleItemClick(item)">
                  <input
                    type="checkbox"
                    :checked="item.itemSelected"
                    :indeterminate="isGroupIndeterminate(item)"
                    class="vueti-check__input"
                  />
                  <span class="vueti-check__box">
                    <svg v-if="item.itemSelected" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <svg v-else-if="isGroupIndeterminate(item)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </span>
                </label>
                <span class="vueti-item__icon" v-if="item.icon">{{ item.icon }}</span>
                <span class="vueti-item__label" v-html="highlightMatch(item.displayName || item.name)"></span>
                <span v-if="item.description" class="vueti-item__desc">{{ item.description }}</span>
                <button
                  v-if="item.subItems && item.subItems.length > 0"
                  type="button"
                  class="vueti-item__expand"
                  @click.stop="toggleGroup(item)"
                  :aria-label="item.expanded ? 'Collapse' : 'Expand'"
                >
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    :class="{ 'vueti-item__expand-icon--open': item.expanded }"
                    class="vueti-item__expand-icon"
                  >
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>

              <!-- Sub Items -->
              <Transition name="vueti-expand">
                <div v-if="item.expanded && item.subItems && item.subItems.length > 0" class="vueti-subitems">
                  <div
                    v-for="subItem in filterSubItems(item)"
                    :key="subItem.id"
                    class="vueti-item vueti-item--sub"
                    :class="{ 'vueti-item--active': highlightedId === subItem.id }"
                    @mouseenter="highlightedId = subItem.id"
                    @click="toggleSubItem(item, subItem)"
                    role="option"
                    :aria-selected="subItem.subItemSelected"
                  >
                    <label class="vueti-check" @click.stop.prevent="toggleSubItem(item, subItem)">
                      <input
                        type="checkbox"
                        :checked="subItem.subItemSelected"
                        class="vueti-check__input"
                      />
                      <span class="vueti-check__box">
                        <svg v-if="subItem.subItemSelected" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                    </label>
                    <span class="vueti-item__icon" v-if="subItem.icon">{{ subItem.icon }}</span>
                    <span class="vueti-item__label" v-html="highlightMatch(subItem.displayName || subItem.name)"></span>
                    <span v-if="subItem.description" class="vueti-item__desc">{{ subItem.description }}</span>
                  </div>
                </div>
              </Transition>
            </template>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="vueti-footer">
            <slot name="footer" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, toRef } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  modelValue: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Select items...' },
  selectAllText: { type: String, default: 'Select all' },
  searchPlaceholder: { type: String, default: 'Search...' },
  emptyText: { type: String, default: 'No results found' },
  notFoundText: { type: String, default: 'No data available' },
  labelLimit: { type: Number, default: 2 },
  tagLimit: { type: Number, default: 3 },
  mode: { type: String, default: 'default', validator: v => ['default', 'tags'].includes(v) },
  size: { type: String, default: 'md', validator: v => ['sm', 'md', 'lg'].includes(v) },
  searchable: { type: Boolean, default: true },
  clearable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  closeOnSelect: { type: Boolean, default: false },
  maxHeight: { type: Number, default: 320 },
})

const emit = defineEmits(['update:modelValue', 'change', 'open', 'close', 'search'])

// Refs
const containerRef = ref(null)
const triggerRef = ref(null)
const dropdownRef = ref(null)
const searchInputRef = ref(null)
const listRef = ref(null)

// State
const isOpen = ref(false)
const searchTerm = ref('')
const highlightedId = ref(null)
const dropdownStyle = ref({})

// Normalize text for accent-insensitive search
function normalizeText(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// Computed: filtered items
const filteredItems = computed(() => {
  if (!searchTerm.value) return props.items

  const term = normalizeText(searchTerm.value)
  return props.items.filter(item => {
    const nameMatch = normalizeText(item.name).includes(term)
    const displayMatch = item.displayName ? normalizeText(item.displayName.replace(/<[^>]*>/g, '')).includes(term) : false

    if (item.subItems && item.subItems.length > 0) {
      const subMatch = item.subItems.some(sub => {
        const sName = normalizeText(sub.name).includes(term)
        const sDisplay = sub.displayName ? normalizeText(sub.displayName.replace(/<[^>]*>/g, '')).includes(term) : false
        return sName || sDisplay
      })
      if (nameMatch || displayMatch || subMatch) {
        item.expanded = true
        return true
      }
      return false
    }
    return nameMatch || displayMatch
  })
})

// Filter sub items during search
function filterSubItems(item) {
  if (!searchTerm.value || !item.subItems) return item.subItems || []
  const term = normalizeText(searchTerm.value)
  const parentMatch = normalizeText(item.name).includes(term)
  if (parentMatch) return item.subItems
  return item.subItems.filter(sub => {
    return normalizeText(sub.name).includes(term) ||
      (sub.displayName ? normalizeText(sub.displayName.replace(/<[^>]*>/g, '')).includes(term) : false)
  })
}

// Get all leaf items (items without subItems + all subItems)
function getAllLeafItems() {
  const leaves = []
  props.items.forEach(item => {
    if (item.subItems && item.subItems.length > 0) {
      item.subItems.forEach(sub => leaves.push(sub))
    } else {
      leaves.push(item)
    }
  })
  return leaves
}

const totalLeafCount = computed(() => getAllLeafItems().length)

// Selected items computation
const selectedItems = computed(() => {
  const selected = []
  props.items.forEach(item => {
    if (item.subItems && item.subItems.length > 0) {
      item.subItems.forEach(sub => {
        if (sub.subItemSelected) selected.push(sub)
      })
    } else if (item.itemSelected) {
      selected.push(item)
    }
  })
  return selected
})

// Is all selected
const isAllSelected = computed(() => {
  const leaves = getAllLeafItems()
  if (leaves.length === 0) return false
  return leaves.every(l => l.subItemSelected !== undefined ? l.subItemSelected : l.itemSelected)
})

// Is indeterminate
const isIndeterminate = computed(() => {
  if (isAllSelected.value) return false
  return selectedItems.value.length > 0
})

// Check if a group is indeterminate
function isGroupIndeterminate(item) {
  if (!item.subItems || item.subItems.length === 0) return false
  const selected = item.subItems.filter(s => s.subItemSelected).length
  return selected > 0 && selected < item.subItems.length
}

// Trigger label
const triggerLabel = computed(() => {
  if (props.items.length === 0) return props.notFoundText
  if (selectedItems.value.length === 0) return props.placeholder
  if (selectedItems.value.length <= props.labelLimit) {
    return selectedItems.value.map(i => i.name).join(', ')
  }
  const shown = selectedItems.value.slice(0, props.labelLimit).map(i => i.name).join(', ')
  return `${shown} (+${selectedItems.value.length - props.labelLimit})`
})

// Tags
const visibleTags = computed(() => selectedItems.value.slice(0, props.tagLimit))
const hiddenTagsCount = computed(() => Math.max(0, selectedItems.value.length - props.tagLimit))

// Highlight search match in text
function highlightMatch(text) {
  if (!searchTerm.value) return text
  const cleanText = text.replace(/<[^>]*>/g, '')
  const term = normalizeText(searchTerm.value)
  const normalizedClean = normalizeText(cleanText)
  const idx = normalizedClean.indexOf(term)
  if (idx === -1) return text

  const before = cleanText.substring(0, idx)
  const match = cleanText.substring(idx, idx + searchTerm.value.length)
  const after = cleanText.substring(idx + searchTerm.value.length)
  return `${before}<mark class="vueti-highlight">${match}</mark>${after}`
}

// Toggle dropdown
function toggleDropdown() {
  if (props.disabled) return
  isOpen.value ? closeDropdown() : openDropdown()
}

function openDropdown() {
  isOpen.value = true
  emit('open')
  nextTick(() => {
    positionDropdown()
    if (props.searchable && searchInputRef.value) {
      searchInputRef.value.focus()
    }
  })
}

function closeDropdown() {
  isOpen.value = false
  searchTerm.value = ''
  highlightedId.value = null
  emit('close')
}

// Position dropdown relative to trigger (Teleported to body)
function positionDropdown() {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const above = spaceBelow < 200 && rect.top > spaceBelow

  dropdownStyle.value = {
    position: 'fixed',
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: 9999,
    ...(above
      ? { bottom: `${window.innerHeight - rect.top + 4}px` }
      : { top: `${rect.bottom + 4}px` }
    )
  }
}

// Item click
function handleItemClick(item) {
  if (item.subItems && item.subItems.length > 0) {
    const newVal = !item.itemSelected
    item.itemSelected = newVal
    item.subItems.forEach(sub => { sub.subItemSelected = newVal })
  } else {
    item.itemSelected = !item.itemSelected
  }
  emitChange()
}

// Sub item toggle
function toggleSubItem(parent, subItem) {
  subItem.subItemSelected = !subItem.subItemSelected
  parent.itemSelected = parent.subItems.every(s => s.subItemSelected)
  emitChange()
}

// Toggle group expand
function toggleGroup(item) {
  item.expanded = !item.expanded
}

// Select all
function toggleSelectAll() {
  const newVal = !isAllSelected.value
  props.items.forEach(item => {
    item.itemSelected = newVal
    if (item.subItems) {
      item.subItems.forEach(sub => { sub.subItemSelected = newVal })
    }
  })
  emitChange()
}

// Clear all selections
function clearAll() {
  props.items.forEach(item => {
    item.itemSelected = false
    if (item.subItems) {
      item.subItems.forEach(sub => { sub.subItemSelected = false })
    }
  })
  emitChange()
}

// Remove a single tag
function removeTag(item) {
  // Check if it's a sub item or a root item
  for (const root of props.items) {
    if (root.subItems) {
      const sub = root.subItems.find(s => s.id === item.id)
      if (sub) {
        sub.subItemSelected = false
        root.itemSelected = root.subItems.every(s => s.subItemSelected)
        emitChange()
        return
      }
    }
    if (root.id === item.id) {
      root.itemSelected = false
      emitChange()
      return
    }
  }
}

// Emit change
function emitChange() {
  const ids = getSelectedIds()
  emit('update:modelValue', ids)
  emit('change', ids, selectedItems.value)
}

// Get selected IDs
function getSelectedIds() {
  const ids = []
  props.items.forEach(item => {
    if (item.subItems && item.subItems.length > 0) {
      item.subItems.forEach(sub => {
        if (sub.subItemSelected) ids.push(sub.id)
      })
    } else if (item.itemSelected) {
      ids.push(item.id)
    }
  })
  return ids
}

// Keyboard navigation on search
function handleSearchKeydown(e) {
  if (e.key === 'Escape') {
    closeDropdown()
    triggerRef.value?.focus()
  }
}

// Keyboard nav on trigger
function handleTriggerKeydown(e) {
  if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
    e.preventDefault()
    if (!isOpen.value) openDropdown()
  }
  if (e.key === 'Escape' && isOpen.value) {
    closeDropdown()
  }
}

// Click outside
function handleClickOutside(e) {
  if (!containerRef.value?.contains(e.target) && !dropdownRef.value?.contains(e.target)) {
    closeDropdown()
  }
}

// Watch search for emit
watch(searchTerm, val => emit('search', val))

// Scroll and resize to reposition
function handleScrollResize() {
  if (isOpen.value) positionDropdown()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
  window.addEventListener('scroll', handleScrollResize, true)
  window.addEventListener('resize', handleScrollResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true)
  window.removeEventListener('scroll', handleScrollResize, true)
  window.removeEventListener('resize', handleScrollResize)
})

// Public API
defineExpose({
  getSelectedIds,
  getSelectedItems: () => selectedItems.value,
  open: openDropdown,
  close: closeDropdown,
  clearAll,
})
</script>

<style scoped>
/* ===== TRIGGER ===== */
.vueti-select {
  position: relative;
  width: 100%;
  font-family: var(--vs-font-family, 'Inter', sans-serif);
}

.vueti-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 42px;
  padding: 6px 12px;
  background: var(--vs-bg);
  border: 2px solid var(--vs-border);
  border-radius: var(--vs-radius-md);
  cursor: pointer;
  transition: all var(--vs-transition);
  font-size: 0.875rem;
  color: var(--vs-text);
  gap: 8px;
  outline: none;
  text-align: left;
}

.vueti-trigger:hover:not(:disabled) {
  border-color: var(--vs-text-muted);
}

.vueti-trigger:focus-visible {
  border-color: var(--vs-border-focus);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.vueti-select--open .vueti-trigger {
  border-color: var(--vs-border-focus);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.vueti-select--error .vueti-trigger {
  border-color: var(--vs-danger);
}

.vueti-select--error .vueti-trigger:focus-visible,
.vueti-select--error.vueti-select--open .vueti-trigger {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.vueti-select--disabled .vueti-trigger {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--vs-bg-secondary);
}

.vueti-select--sm .vueti-trigger {
  min-height: 34px;
  font-size: 0.8rem;
  padding: 4px 10px;
}

.vueti-select--lg .vueti-trigger {
  min-height: 50px;
  font-size: 1rem;
  padding: 8px 14px;
  border-radius: var(--vs-radius-lg);
}

.vueti-trigger__content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.vueti-trigger__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.vueti-trigger__label--placeholder {
  color: var(--vs-text-muted);
}

.vueti-trigger__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.vueti-trigger__counter {
  background: var(--vs-primary);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 100px;
  min-width: 20px;
  text-align: center;
  line-height: 1.5;
}

.vueti-trigger__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--vs-text-muted);
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: all var(--vs-transition);
}

.vueti-trigger__clear:hover {
  color: var(--vs-danger);
  background: var(--vs-danger-light);
}

.vueti-trigger__chevron {
  color: var(--vs-text-muted);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.vueti-select--open .vueti-trigger__chevron {
  transform: rotate(180deg);
}

/* ===== TAGS ===== */
.vueti-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.vueti-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  background: var(--vs-primary-ultra-light);
  color: var(--vs-primary);
  border: 1px solid transparent;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.5;
  transition: all var(--vs-transition);
}

.vueti-tag--more {
  background: var(--vs-bg-hover);
  color: var(--vs-text-secondary);
  font-weight: 600;
}

.vueti-tag__text {
  max-width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.vueti-tag__remove {
  display: flex;
  align-items: center;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  padding: 1px;
  border-radius: 50%;
  opacity: 0.7;
  transition: all var(--vs-transition);
}

.vueti-tag__remove:hover {
  opacity: 1;
  background: rgba(0,0,0,0.1);
}

/* ===== ERROR ===== */
.vueti-error {
  display: block;
  font-size: 0.75rem;
  color: var(--vs-danger);
  margin-top: 4px;
  padding-left: 2px;
}

/* ===== DROPDOWN ===== */
.vueti-dropdown {
  background: var(--vs-bg);
  border: 1px solid var(--vs-border);
  border-radius: var(--vs-radius-md);
  box-shadow: var(--vs-shadow-lg);
  overflow: hidden;
  font-family: var(--vs-font-family, 'Inter', sans-serif);
  color: var(--vs-text);
}

/* ===== SEARCH ===== */
.vueti-search {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--vs-border);
  gap: 8px;
  background: var(--vs-bg);
}

.vueti-search__icon {
  color: var(--vs-text-muted);
  flex-shrink: 0;
}

.vueti-search__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: var(--vs-text);
  font-family: inherit;
}

.vueti-search__input::placeholder {
  color: var(--vs-text-muted);
}

.vueti-search__clear {
  display: flex;
  align-items: center;
  border: none;
  background: none;
  color: var(--vs-text-muted);
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: all var(--vs-transition);
}

.vueti-search__clear:hover {
  color: var(--vs-danger);
}

/* ===== TOOLBAR ===== */
.vueti-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--vs-border);
  background: var(--vs-bg-secondary);
}

.vueti-toolbar__label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vs-text-secondary);
}

.vueti-toolbar__count {
  font-size: 0.75rem;
  color: var(--vs-text-muted);
}

.vueti-toolbar__count-num {
  font-weight: 700;
  color: var(--vs-primary);
}

/* ===== CHECKBOX ===== */
.vueti-check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.vueti-check__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.vueti-check__box {
  width: 18px;
  height: 18px;
  border: 2px solid var(--vs-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--vs-transition);
  flex-shrink: 0;
  background: var(--vs-bg);
}

.vueti-check__input:checked + .vueti-check__box {
  background: var(--vs-primary);
  border-color: var(--vs-primary);
  color: #fff;
}

.vueti-check__input:indeterminate + .vueti-check__box {
  background: var(--vs-primary);
  border-color: var(--vs-primary);
  color: #fff;
}

/* ===== LIST ===== */
.vueti-list {
  max-height: v-bind('maxHeight + "px"');
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
}

.vueti-list::-webkit-scrollbar {
  width: 6px;
}

.vueti-list::-webkit-scrollbar-track {
  background: transparent;
}

.vueti-list::-webkit-scrollbar-thumb {
  background: var(--vs-border);
  border-radius: 100px;
}

.vueti-list::-webkit-scrollbar-thumb:hover {
  background: var(--vs-text-muted);
}

/* ===== ITEMS ===== */
.vueti-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background var(--vs-transition);
  font-size: 0.875rem;
}

.vueti-item:hover,
.vueti-item--active {
  background: var(--vs-bg-hover);
}

.vueti-item--sub {
  padding-left: 40px;
}

.vueti-item__icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.vueti-item__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vueti-item__desc {
  font-size: 0.7rem;
  color: var(--vs-text-muted);
  flex-shrink: 0;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vueti-item__expand {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--vs-text-muted);
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: all var(--vs-transition);
}

.vueti-item__expand:hover {
  background: var(--vs-border);
  color: var(--vs-text);
}

.vueti-item__expand-icon {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.vueti-item__expand-icon--open {
  transform: rotate(90deg);
}

/* ===== EMPTY ===== */
.vueti-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 2rem;
  color: var(--vs-text-muted);
  font-size: 0.875rem;
}

/* ===== SUBITEMS ===== */
.vueti-subitems {
  border-left: 2px solid var(--vs-primary-ultra-light);
  margin-left: 24px;
}

/* ===== FOOTER ===== */
.vueti-footer {
  padding: 8px 12px;
  border-top: 1px solid var(--vs-border);
  background: var(--vs-bg-secondary);
}

/* ===== HIGHLIGHT ===== */
:deep(.vueti-highlight) {
  background: #fef08a;
  color: #854d0e;
  border-radius: 2px;
  padding: 0 1px;
}

[data-theme="dark"] :deep(.vueti-highlight) {
  background: #854d0e;
  color: #fef08a;
}

/* ===== ANIMATIONS ===== */
.vueti-dropdown-enter-active {
  animation: vueti-dropdown-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.vueti-dropdown-leave-active {
  animation: vueti-dropdown-out 0.15s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes vueti-dropdown-in {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes vueti-dropdown-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
}

.vueti-fade-enter-active,
.vueti-fade-leave-active {
  transition: opacity 0.15s ease;
}

.vueti-fade-enter-from,
.vueti-fade-leave-to {
  opacity: 0;
}

.vueti-slide-enter-active {
  transition: all 0.2s ease;
}

.vueti-slide-leave-active {
  transition: all 0.15s ease;
}

.vueti-slide-enter-from,
.vueti-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.vueti-expand-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.vueti-expand-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
  overflow: hidden;
}

.vueti-expand-enter-from,
.vueti-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.vueti-expand-enter-to,
.vueti-expand-leave-from {
  max-height: 500px;
}

.vueti-tag-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.vueti-tag-leave-active {
  transition: all 0.15s ease;
}

.vueti-tag-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.vueti-tag-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
</style>
