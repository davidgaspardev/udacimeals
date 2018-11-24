import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addRecipe, removeFromCalendar } from '../actions';
import { capitalize } from '../utils/helpers';
import { fetchRecipes } from '../utils/api';
import CalendarIcon from 'react-icons/lib/fa/calendar-plus-o';
import ArrowRightIcon from 'react-icons/lib/fa/arrow-circle-right';
import Modal from 'react-modal';
import Loading from 'react-loading';
import FoodList from './FoodList';
import ShoppingList from './ShoppingList';

class App extends Component {

  constructor(props) {
    super(props);

    this.openFoodModal         = this.openFoodModal.bind(this);
    this.openIngredientsModal  = this.openIngredientsModal.bind(this);
    this.closeFoodModal        = this.closeFoodModal.bind(this);
    this.closeIngredientsModal = this.closeIngredientsModal.bind(this);
    this.searchFood            = this.searchFood.bind(this);

    console.log('Props', this.props);
    console.log('State', this.props);

  }

  /**
   * State of class
   */
  state = {
    loadingFood: Boolean(false),
    foodModalOpen: Boolean(false),
    ingredientsModalOpen: Boolean(false),
    meal: null,
    day: null,
    food: null
  }

  openFoodModal({ meal, day }) {

    console.log(meal, day);

    this.setState(() => ({
      foodModalOpen: true,
      meal,
      day
    }));
  }

  openIngredientsModal() {
    this.setState({ ingredientsModalOpen: true })
  }

  closeFoodModal() {
    this.setState(() => ({
      foodModalOpen: false,
      meal: null,
      day: null,
      food: null
    }))
  }

  closeIngredientsModal() {
    this.setState({ ingredientsModalOpen: false })
  }

  generateShoppingList() {
    return this.props.calendar.reduce((result, { meals }) => {
      const { breakfast, lunch, dinner } = meals;

      // If breakfast is different than null, push
      breakfast && result.push(breakfast);

      // If lunch is different than null, push
      lunch && result.push(lunch);

      // If dinner is different than null, push
      dinner && result.push(dinner);

      return result;

    }, [])
    .reduce((ings, { ingredientLines }) => ings.concat(ingredientLines), []);
  }

  searchFood(e) {

    console.log(this.input);

    if(!this.input.value) return null;

    e.preventDefault();
    this.setState({ loadingFood: true });

    fetchRecipes(this.input.value).then((food) =>
      this.setState({ food, loadingFood: false })
    );

  }

  render() {
    const mealOrder = ['breakfast', 'lunch', 'dinner'];
    const { calendar, removeRecipe, selectRecipe } = this.props;
    const { foodModalOpen, ingredientsModalOpen, loadingFood, food } = this.state;

    return (
      <div className='container'>
        <div className='nav'>
          <h1 className='header'>UdaciMeals</h1>
          <button
            className='shopping-list'
            onClick={this.openIngredientsModal}>
            Shopping List
          </button>
        </div>

        <ul className='meal-types' >
          {
            mealOrder.map(mealType => (
              <li key={mealType} className='subheader' >
                { capitalize(mealType) }
              </li>
            ))
          }
        </ul>

        <div className='calendar'>
          <div className='days' >
            {calendar.map( ({day}) => <h3 key={day} className='subheader'>{capitalize(day)}</h3>)}
          </div>
          <div className='icon-grid'>
            {
              calendar.map( ({day, meals}) => (
                <ul key={day}>
                  {
                    mealOrder.map( meal => (
                      <li key={meal} className='meal' >
                        {
                          meals[meal] ?
                          <div className='food-item'>
                            <img src={meals[meal].image} alt={meals[meal].label}/>
                            <button onClick={() => removeRecipe({ meal, day })} >Clear</button>
                          </div>
                          :
                          <button onClick={() => this.openFoodModal({ meal, day })} className='icon-btn'>
                            <CalendarIcon size={30} />
                          </button>
                        }
                      </li>
                    ))
                  }
                </ul>
              ))
            }
          </div>
        </div>

        <Modal
         className='modal'
         overlayClassName='overlay'
         isOpen={foodModalOpen}
         onRequestClose={this.closeFoodModal}
         contentLabel='Modal'>

         <div>
           {loadingFood === true
             ? <Loading delay={200} type='spin' color='#222' className='loading' />
             : <div className='search-container'>
                 <h3 className='subheader'>
                   Find a meal for {capitalize(this.state.day)} {this.state.meal}.
                 </h3>
                 <div className='search'>
                   <input
                     className='food-input'
                     type='text'
                     placeholder='Search Foods'
                     ref={(input) => this.input = input}
                   />
                   <button
                     className='icon-btn'
                     onClick={this.searchFood}>
                       <ArrowRightIcon size={30}/>
                   </button>
                 </div>
                 {food !== null && (
                   <FoodList
                     food={food}
                     onSelect={(recipe) => {
                       selectRecipe({recipe, day: this.state.day, meal: this.state.meal });
                       this.closeFoodModal();
                     }}
                   />)}
               </div>}
         </div>
       </Modal>

       <Modal
        className='modal'
        overlayClassName='overlay'
        isOpen={ingredientsModalOpen}
        onRequestClose={this.closeIngredientsModal}
        contentLabel='Modal'>

        {
          ingredientsModalOpen && <ShoppingList list={this.generateShoppingList()} />
        }

       </Modal>

      </div>
    );
  }
}

// Currying
function mapDispatchToProps(dispatch) {
  return {
    selectRecipe: (data) => dispatch(addRecipe(data)),
    removeRecipe: (data) => dispatch(removeFromCalendar(data))
  }
}

function mapStateToProps({ calendar, food }) {
  const dayOrde = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  return {
    calendar: dayOrde.map(day => ({
      day,
      meals: Object.keys(calendar[day]).reduce((meals, meal) => {
        meals[meal] = calendar[day][meal] ? food[calendar[day][meal]] : null;

        return meals;
      }, {})
    }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
