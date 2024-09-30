import {useSelector } from 'react-redux'
import type { RootState } from "@/store/configureStore";


export const useAppSelector = useSelector.withTypes<RootState>();