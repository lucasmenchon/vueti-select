var VuetiSelect = Vue.component("VuetiSelect", {
  template: `
  <div id="VuetiSelect" class="vuetiSelectBox">
    <div class="dropdownContainer">
      <div class="buttonBox">
        <button type="button" :class="cssBtnBox.customBtn" @click="toggleDropdown()">
          <span>{{ selectedOptionsText }}</span>
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
                {{ selectAllTitle }}
              </label>
            </div>
            <ul class="ulMenu">
              <li v-for="group in filteredOptions" class="groupItem">
                <div class="groupBox">
                  <input type="checkbox" id="no-margin" class="groupCheckbox" v-model="group.selectAllObjects" @change="toggleSelectAllObjects(group)" :value="group.name" />
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
    noOptionTitle: String,
    selectAllTitle: String,
    labelLimit: Number,
  },
  data() {
    return {
      groups: this.value.map(group => ({
        ...group,
        selectAllObjects: false,
      })),
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
      selectAll: false,
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
    selectedOptionsText() {
      if (this.selectedOptions.length === 0) {
        return this.noOptionTitle;
      } else if (this.selectedOptions.length <= this.labelLimit) {
        return this.selectedOptions.join(", ");
      } else {
        const selectedCount = this.selectedOptions.length - this.labelLimit;
        const selectedNames = this.selectedOptions
          .slice(0, this.labelLimit)
          .join(", ");
        return `${selectedNames} (+${selectedCount})`;
      }
    },
  },
  watch: {
    selectAll(newValue) {
      if (newValue) {
        this.selectedOptions = this.filteredOptions.flatMap(group => group.objects);
      } else {
        this.selectedOptions = [];
      }
    },
    // 'groups': {
    //   handler(groups) {
    //     groups.forEach((group) => {
    //       if (group.selectAllObjects) {
    //         this.selectedOptions.push(...group.objects);
    //       } else {
    //         this.selectedOptions = this.selectedOptions.filter(
    //           (option) => !group.objects.includes(option)
    //         );
    //       }
    //     });
    //   },
    //   deep: true,
    // },
  },
  methods: {

    toggleSelectAllObjects(group) {
      if (group.selectAllObjects) {
        this.selectedOptions = [...this.selectedOptions, ...group.objects];
      } else {
        this.selectedOptions = this.selectedOptions.filter((option) =>
          option !== group.name && !group.objects.includes(option)
        );
      }
    },

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
