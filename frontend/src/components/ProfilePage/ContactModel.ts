import { freeze } from "immer";
import { PersonModel, usePersonModelDefaults } from "./PersonModel";
// import { AddressModel } from "./AddressModel";

/**
 * model
 */

interface UserModel {
  readonly person: PersonModel;
}

/**
 * default values
 */

const useContactModelDefaults = (): UserModel => ({
  person: usePersonModelDefaults(),
});

/**
 * constructor
 */

export default function GetNewContactModel(contact: Partial<UserModel> = {}) {
  return freeze(
    {
      ...useContactModelDefaults(),
      ...contact
    },
    true
  );
}

/**
 * methods
 */

// export function addAddress(contact: ContactModel, address: AddressModel) {
//   const addressAlreadyExists = contact.addresses.some(
//     ({ id }) => id === address.id
//   );

//   if (addressAlreadyExists) {
//     throw new Error("address already exists on this contact");
//   }

//   return getNewContactModel({
//     ...contact,
//     addresses: [...contact.addresses, address]
//   });
// }

// export function removeAddress(contact: ContactModel, address: AddressModel) {
//   return getNewContactModel({
//     ...contact,
//     addresses: contact.addresses.filter(({ id }) => id !== address.id)
//   });
// }
