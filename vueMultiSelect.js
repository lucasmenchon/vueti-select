var VueMultiSelect = Vue.component('VueMultiSelect', {
  template: `
  <div id="VueMultiSelect" class="dropdown">
    <button class="btn btn-default dropdown-toggle form-control" type="button" @click="toggleDropdown">
      {{ selectedOptions.length === 0 ? 'Nenhuma opção selecionada' : selectedOptions.join(', ') }}
      <span class="caret"></span>
    </button>
    <ul v-show="showDropdown" class="dropdown-menu">
      <li class="search-bar">
        <div class="input-group">
          <input type="text" v-model="searchTerm" placeholder="Pesquisar" class="form-control" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary clear-button" type="button" @click="clearSearch">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </li>
      <li v-for="group in filteredOptions" :key="group.name">
        <div class="group-header">
          <label class="checkbox-label">
            <input type="checkbox" v-model="selectedOptions" :value="group.name" class="form-check-input select-all-checkbox" />
            {{ group.name }}
          </label>
          <button class="group-toggle-button" type="button" @click="toggleGroup(group)">
            <i class="fas" :class="group.expanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
          </button>
        </div>
        <ul v-show="group.expanded">
          <li v-for="object in group.objects" :key="object">
            <label class="checkbox-label">
              <input type="checkbox" v-model="selectedOptions" :value="object" class="form-check-input" />
              {{ object }}
            </label>
          </li>
        </ul>
      </li>
    </ul>
  </div>
`,
  data() {
    return {
      groups: [
        { name: 'roupas', expanded: false, objects: ['calça', 'camisa', 'casaco'] },
        { name: 'acessórios', expanded: false, objects: ['óculos', 'boné', 'colar'] },
        { name: 'eletrônicos', expanded: false, objects: ['smartphone', 'notebook', 'fones de ouvido'] }
      ],
      selectedOptions: [],
      searchTerm: '',
      showDropdown: false
    }
  },
  computed: {
    filteredOptions() {
      return this.groups.filter(group =>
        group.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        group.objects.some(object =>
          object.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    clearSearch() {
      this.searchTerm = '';
    },
    toggleGroup(group) {
      group.expanded = !group.expanded;
    }
  }
});
