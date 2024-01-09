import { eventBus } from "./index";
import { FacilityLoader, FacilityRepository } from "@microsoft/msfs-sdk";

export const facilityLoader = new FacilityLoader(FacilityRepository.getRepository(eventBus));

export const getIdentFromIcao = (icao: string): string => icao.slice(-5).trim();

export const getAirportIcaoFromIdent = (ident: string): string => `A      ${ident.padEnd(5)}`;