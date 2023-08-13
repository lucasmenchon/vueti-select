var VuetiSelect = Vue.component("VuetiSelect", {
  template: `
  <div id="VuetiSelect" class="vuetiSelectBox">
    <div class="dropdownContainer">
      <div class="buttonBox">
        <button type="button" :class="cssBtnBox.customBtn" @click="toggleDropdown()">
          <span>{{ selectedOptions.length === 0 ? 'No Option Selected' : selectedOptions.join(', ') }}</span>
          <i :class="cssBtnBox.icon"></i>
        </button>
      </div>
      <transition name="fade">
        <div v-if="showDropdownMenu" :class="cssDropdownMenu">
          <div class="searchBox">
            <div class="svgSearchBox">
              <i class="svgSearch"></i>
            </div>
            <input type="text" v-model="searchTerm" placeholder="Search" class="searchBar" />
            <button class="clearButton" type="button" @click="clearSearch">
              <i class="svgEraser"></i>
            </button>
          </div>
          <div :class="cssUlBox">
            <div class="boxSelectAll">
              <label class="labelSelectAll">
                <input type="checkbox" v-model="selectAll" id="no-margin" class="inputSelectAll" />
                Select All
              </label>
            </div>
            <ul class="ulMenu">
              <li v-for="group in filteredOptions" class="groupItem">
                <div class="groupBox">
                  <input type="checkbox" id="no-margin" class="groupCheckbox" v-model="selectedOptions" :value="group.name" />
                  <label class="groupLabel">
                    {{ group.name }}
                  <button type="button" @click="toggleGroup(group)" class="checkboxButton">
                    <i :class="group.cssCheckbox"></i>
                  </button>
                  </label>
                </div>
                <transition name="fade">
                  <ul v-show="group.expanded" class="groupObjects">
                    <li v-for="object in group.objects" :key="object">
                      <label class="">
                        <input type="checkbox" v-model="selectedOptions" :value="object" />
                        {{ object }}
                      </label>
                    </li>
                  </ul>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
  `,
  props: {
    value: Array,    
  },
  data() {
    return {     
      groups: this.value, 
      selectedOptions: [],
      searchTerm: "",
      showDropdownMenu: false,
      cssBtnBox: {
        customBtn: "close-btnVueti",
        icon: "svgCaretDown closed",
      },
      cssUlBox: "",
      cssDropdownMenu: "dropdownMenu",
      isMouseOver: false,
    };
  },  
  computed: {
    filteredOptions() {
      return this.groups.filter(
        (group) =>
          group.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          group.objects.some((object) =>
            object.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
      );
    },
  },
  methods: {
    toggleDropdown() {
      this.showDropdownMenu = !this.showDropdownMenu;
      if (this.showDropdownMenu) {
        this.cssDropdownMenu = "dropdownMenu";
        this.cssBtnBox.customBtn = "open-btnVueti";
        this.cssBtnBox.icon = "svgCaretDown open";
        this.cssUlBox = "ulBox";
        document.addEventListener("click", this.handleOutsideClick);
      } else {
        this.cssDropdownMenu = "dropdownMenu";
        this.cssBtnBox.customBtn = "close-btnVueti";
        this.cssBtnBox.icon = "svgCaretDown closed";
        this.cssUlBox = "";
        this.searchTerm = "";
        document.removeEventListener("click", this.handleOutsideClick);
      }
    },

    clearSearch() {
      this.searchTerm = "";
    },

    toggleGroup(group) {
      group.expanded = !group.expanded;
      if (group.expanded) {
        group.cssCheckbox = "svgArrow open";
      } else {
        group.cssCheckbox = "svgArrow";
      }
    },

    handleOutsideClick(event) {
      if (this.showDropdownMenu && !this.$el.contains(event.target)) {
        this.cssDropdownMenu = "dropdownMenu";
        this.cssBtnBox.customBtn = "close-btnVueti";
        this.cssBtnBox.icon = "svgCaretDown closed";
        this.cssUlBox = "";
        this.searchTerm = "";
        this.showDropdownMenu = false;
        document.removeEventListener("click", this.handleOutsideClick);
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
});
