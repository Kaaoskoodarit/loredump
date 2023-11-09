import * from './AssignCategories'
const defaultCategories = ["Characters","NPCs","Locations","Dates"]
.cat

let categoriesDropdown = []
        defaultCategories.map(category => {
        categoriesDropdown.push(<option key={category} value={category}>{category}</option>)
        });