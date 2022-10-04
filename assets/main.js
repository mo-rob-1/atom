class CustomerAddress {
    constructor() {
        this.initCustomerAddress();
        this.customerAddressesSelector();
        this.initDeleteAddressButtons();
    }

    initDeleteAddressButtons() {
        const deleteButtons = document.querySelectorAll("button[data-delete-address]");
        if (deleteButtons.length < 1) 
            return;
        


        deleteButtons.forEach(button => {
            button.addEventListener("click", function (e) {
                var url = this.dataset.url;
                var confirmation = window.confirm("Do you really wish to delete this address?");
                if (confirmation) {
                    document.querySelector(`form[action="${url}"]`).submit();
                }
            })
        })
    }


    initCustomerAddress() {
        const allAddressesSelector = document.querySelectorAll("select[data-country-selector]");
        if (allAddressesSelector.length < 1) 
            return;
        


        // console.log(allAddressesSelector);
        allAddressesSelector.forEach(select => {
            var selectedCountry = this.getSelectedCountry(select);
            if (! selectedCountry) 
                return;
            


            var provinces = selectedCountry.dataset.provinces;
            var arrayOfProvince = JSON.parse(provinces);
            var provinceSelector = document.querySelector(`#address_province_${
                select.dataset.id
            }`);
            if (arrayOfProvince.length < 1) {
                provinceSelector.setAttribute("disabled", "disabled");
            } else {
                provinceSelector.removeAttribute("disabled");
            }
            provinceSelector.innerHTML = "";
            var options = "";
            for (var index = 0; index < arrayOfProvince.length; index++) {
                if (arrayOfProvince[index][0] === provinceSelector.getAttribute("value")) {
                    options += `<option value="${
                        arrayOfProvince[index][0]
                    }" selected>${
                        arrayOfProvince[index][0]
                    }</option>`;
                } else {
                    options += `<option value="${
                        arrayOfProvince[index][0]
                    }">${
                        arrayOfProvince[index][0]
                    }</option>`;
                }
            }
            provinceSelector.innerHTML = options;
        })
    }
    getSelectedCountry(select) {
        var option,
            selectedOption;
        for (var index = 0; index < select.options.length; index++) {
            option = select.options[index];
            if (option.value === select.getAttribute("value")) {
                selectedOption = option;
                selectedOption.setAttribute("selected", "selected");
                break;
            }
        }
        return selectedOption;
    }

    customerAddressesSelector() {
        const addressesSelector = document.querySelectorAll("select[data-country-selector]");
        if (addressesSelector.length < 1) 
            return;
        


        addressesSelector.forEach(select => {
            select.addEventListener("change", function (e) {
                var provinces = this
                    .options[this.selectedIndex]
                    .dataset
                    .provinces;
                var arrayOfProvince = JSON.parse(provinces);
                var provinceSelector = document.querySelector(`#address_province_${
                    this.dataset.id
                }`);
                if (arrayOfProvince.length < 1) {
                    provinceSelector.setAttribute("disabled", "disabled");
                } else {
                    provinceSelector.removeAttribute("disabled");
                }
                provinceSelector.innerHTML = "";
                var options = "";
                for (var index = 0; index < arrayOfProvince.length; index++) {
                    options += `<option value="${
                        arrayOfProvince[index][0]
                    }">${
                        arrayOfProvince[index][0]
                    }</option>`;
                }
                provinceSelector.innerHTML = options;
            });
        });
    }
}
const customerAddress = new CustomerAddress();
class VariantSelector extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("change", this.onVariantChange);
    }
    onVariantChange() {
        this.getSelectedOptions();
        this.getSelectedVariant();
        if(this.currentVariant) {
            this.updateURL();
            this.updateFormID();
            this.updatePrice();
        }
    }
    getSelectedOptions() {
        this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
        console.log(this.options);
    }
    getVariantJSON() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
        return this.variantData;
    }
    getSelectedVariant() {
        this.currentVariant = this.getVariantJSON().find(
            (variant) => {
                const findings = !variant.options.map(
                    (option, index) => {
                        return this.options[index] === option;
                    }
                ).includes(false);
                if(findings) return variant;
            }
        );
        console.log(this.currentVariant);
    }
    updateURL() {
        if(!this.currentVariant) return;
        window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
    }
    updateFormID() {
        const form_input = document.querySelector("#product-form").querySelector('input[name="id"]');
        form_input.value = this.currentVariant.id;
    }
    updatePrice() {
        fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
        .then((response) => response.text())
        .then((responseText) => {
            const id = `price-${this.dataset.section}`;
            const html = new DOMParser().parseFromString(responseText, 'text/html');
            const oldPrice = document.getElementById(id);
            const newPrice = html.getElementById(id);
            if(oldPrice && newPrice) oldPrice.innerHTML = newPrice.innerHTML;
        });
    }
}
customElements.define("variant-selector", VariantSelector);