var VueMultiSelect = Vue.component('VueMultiSelect', {
  el: '#VueMultiSelect',
  template: `<div id="VueMultiSelect">
    <input type="text" v-model="searchTerm" placeholder="Pesquisar" />
    <ul>
      <li v-for="option in filteredOptions" :key="option.value">
        <label>
          <input type="checkbox" v-model="selectedOptions" :value="option.value" />
          {{ option.label }}
        </label>
      </li>
    </ul>
  </div>`,
  data() {
    return {
      options: [],
      selectedOptions: [],
      searchTerm: ''
    }
  },
  computed: {
    filteredOptions() {
      return this.options.filter(option =>
        option.label.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  },
  methods(){
  },  
});
