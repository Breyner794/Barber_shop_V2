import React, { createContext, useReducer, useContext } from "react";

const initialState = {
  service: null,
  site: null,
  barber: null,
  date: null,
  startTime: null,
  endTime: null,
  clientName: '',
  clientPhone: '',
  clientEmail: '',
};

const BookingContext = createContext (initialState);

const bookingReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SERVICE':
            return {...state, service: action.payload};
            case ('SET_SITE'):
                return {...state, site: action.payload};
                case 'SET_BARBER':
                    return {...state, barber: action.payload};
                    case 'SET_TIME_SLOT':
                        return {
                            ...state,
                            date: action.payload.date,
                            startTime: action.payload.startTime,
                            endTime: action.payload.endTime,
                        };
                        case 'SET_CLIENT_DETAILS':
                            return {
                                ...state,
                                clientName: action.payload.name,
                                clientPhone: action.payload.phone,
                                clientEmail: action.payload.email,
                            }
                            case 'RESET_BOOKING':
                                return initialState;
                                default:
                                    return state;
    }
};

export const BookingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    const setService = (service) => dispatch({type: 'SET_SERVICE', payload: service});
    const setSite = (site) => dispatch({type: 'SET_SITE', payload: site});
    const setBarber = (barber) => dispatch({type: 'SET_BARBER', payload: barber});

    //recibe el bloque de tiempo completo
    const setTimeSlot = (slot) => {
        dispatch({ type: 'SET_TIME_SLOT', payload: slot });
    };

    const setClientDetails = (details) => dispatch ({ type: 'SET_CLIENT_DETAILS', payload: details });
    const resetBooking = () => dispatch ({ type: 'RESET_BOOKING'});

     return (
       <BookingContext.Provider
         value={{
           bookingDetails: state,
           setService,
           setSite,
           setBarber,
           setTimeSlot,
           setClientDetails,
           resetBooking,
         }}
       >
         {children}
       </BookingContext.Provider>
     );

}

export const useBooking = () => {
    return useContext(BookingContext);
}