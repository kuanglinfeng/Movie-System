import { IMovie } from '../../services/MovieService'
import { ISearchCondition } from '../../services/CommonTypes'
import { MovieActions, SaveMoviesAction, SetConditionAction, SetLoadingAction, DeleteAction, MovieChangeSwitchAction } from '../actions/MovieAction'
import { Reducer } from 'react'

// 让ISearchCondition接口里的类型都变为必填的 再赋给新类型
export type IMovieCondition = Required<ISearchCondition>

/**
 * 电影状态
 */
export interface IMovieState {
  /**
   * 电影数组
   */
  data: IMovie[]

  /**
   * 查询条件
   */
  condition: IMovieCondition

  /**
   * 总记录数
   */
  total: number

  /**
   * 是否正在加载数据
   */
  isLoading: boolean

  /**
   * 总页数
   */
  totalPage: number
}


const defaultState: IMovieState = {
  data: [],
  condition: {
    page: 1,
    limit: 10,
    key: ''
  },
  total: 0,
  isLoading: false,
  totalPage: 0
}

// function saveMovie(state: IMovieState, action: SaveMoviesAction): IMovieState {

// }

type MovieReducer<A> = Reducer<IMovieState, A>

const saveMovie: MovieReducer<SaveMoviesAction> = function (state, action) {
  return {
     ...state,
     data: action.payload.movies,
     total: action.payload.total,
     totalPage: Math.ceil(action.payload.total / state.condition.limit)
  }
}

const setCondition: MovieReducer<SetConditionAction> = function (state, action) {
  const newState = {
    ...state,
    condition: {
      ...state.condition,
      ...action.payload
    }
  }
  newState.totalPage = Math.ceil(newState.total / newState.condition.limit)
  return newState
}

const setLoading: MovieReducer<SetLoadingAction> = function (state, action) {
  return {
     ...state,
    isLoading: action.payload
  }
}

const deleteMovie: MovieReducer<DeleteAction> = function (state, action) {
  return {
    ...state,
    data: state.data.filter(m => m._id !== action.payload),
    total: state.total - 1,
    totalPage: Math.ceil((state.total - 1) / state.condition.limit)
  }
}

const changeSwitch: MovieReducer<MovieChangeSwitchAction> = function (state, action) {

  // 1.根据id找到对象
  const movie = state.data.find(item => item._id === action.payload.id)
  if (!movie) {
    return state
  }
  // 2. 对象克隆
  const newMovie = {...movie}
  newMovie[action.payload.type] = action.payload.newVal
  // 3. 将对象重新放入到数组
  const newData = state.data.map(item => {
    if (item._id === action.payload.id) {
      return newMovie
    } else {
      return item
    }
  })

  return {
    ...state,
    data: newData
  }
}


export default function (state: IMovieState = defaultState, action: MovieActions): IMovieState {
  // 可辨识的联合
  switch (action.type) {
    case 'movie_delete': 
      return deleteMovie(state, action)
    case  'movie_save': 
      return saveMovie(state, action)
    case 'movie_setCondition': 
      return setCondition(state, action)
    case 'movie_setLoading': 
      return setLoading(state, action)
    case 'movie_switch':
      return changeSwitch(state, action)
    default: 
      return state
  }
}