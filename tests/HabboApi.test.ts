import { describe, it, expect, beforeAll, jest, beforeEach } from '@jest/globals';
import axios from "axios";
import { HabboApi } from '../src/scripts/validator/api/HabboApi';

jest.mock("axios");
const mockedAxios = jest.mocked(axios, true);

describe('Habbo Api', () => {
    beforeEach(() => {
        mockedAxios.mockReset();
    });
    it('get user by name', () => {
        const resp = {data: {}};
        mockedAxios.get.mockResolvedValue(resp);
        HabboApi.getUserByName("test");
        expect(mockedAxios.get).toHaveBeenCalledWith("https://www.habbo.es/api/public/users?name=test");
    });
    it('get profile', () => {
        const resp = {data: {}};
        mockedAxios.get.mockResolvedValue(resp);
        HabboApi.getProfile("test");
        expect(mockedAxios.get).toHaveBeenCalledWith("https://www.habbo.es/api/public/users/test/profile");
    });
});