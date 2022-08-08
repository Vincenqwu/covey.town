
/**
 * model
 */

export interface PersonModel {
  readonly nickName: string;
  readonly email: string;
  password: string;
}

/**
 * default values
 */

export const usePersonModelDefaults = (): PersonModel => ({
  nickName: "",
  email: "",
  password: ""
});

/**
 * constructor
 */

export function GetNewPersonModel(person: Partial<PersonModel> = {}) {
  return ({
    ...usePersonModelDefaults(),
    ...person
  });
}