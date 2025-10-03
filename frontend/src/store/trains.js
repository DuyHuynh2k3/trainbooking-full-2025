import { create } from 'zustand';

const useStore = create((set) => ({
  // State
  station: {
    departureDate: '',
    returnDate: '',
    departureStationId: null,
    arrivalStationId: null,
    ticketType: 'oneWay', // 'oneWay' or 'roundTrip'
    departureStation: '',
    arrivalStation: ''
  },
  trains: [],    // Danh sách tàu chiều đi
  trainsReturn: [],  // Danh sách tàu chiều về (nếu là khứ hồi)
  loading: false,
  loadingReturn: false,

  // Actions
  // Cập nhật toàn bộ station
  setStation: (stationData) => {
    console.log("Setting station with data:", stationData);
    set({ 
      station: { 
        ...stationData,
        // Đảm bảo ticketType hợp lệ
        ticketType: stationData.ticketType === 'roundTrip' ? 'roundTrip' : 'oneWay'
      } 
    });
  },

  // Cập nhật từng phần station
  updateStation: (updates) => {
    console.log("Updating station with:", updates);
    set(state => ({
      station: { 
        ...state.station, 
        ...updates,
        // Validate ticketType
        ticketType: updates.ticketType === 'roundTrip' ? 'roundTrip' : state.station.ticketType
      }
    }));
  },

  // Cập nhật danh sách tàu
  setTrains: (trains) => {
    console.log("Setting trains data:", trains);
    set({ trains });
  },
  setTrainsReturn: (trainsReturn) => {
    console.log("Setting return trains data:", trainsReturn);
    set({ trainsReturn });
  },

  // Cập nhật trạng thái loading
  setLoading: (loading) => {
    console.log("Setting loading status:", loading);
    set({ loading });
  },
  setLoadingReturn: (loadingReturn) => {
    console.log("Setting return loading status:", loadingReturn);
    set({ loadingReturn });
  },

  // Reset state
  resetSearch: () => {
    console.log("Resetting search state...");
    set({
      station: {
        departureDate: '',
        returnDate: '',
        departureStationId: null,
        arrivalStationId: null,
        ticketType: 'oneWay',
        departureStation: '',
        arrivalStation: ''
      },
      trains: [],
      trainsReturn: [],
      loading: false,
      loadingReturn: false
    });
  }
}));

export default useStore;
