
/**
 * model
 */

export interface PersonModel {
  readonly userName: string;
  readonly email: string;
  password: string;
}

/**
 * default values
 */

export const usePersonModelDefaults = (): PersonModel => ({
  userName: "",
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