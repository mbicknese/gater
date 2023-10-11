> [!IMPORTANT]  
> This is a tech demo, please use a vetted library like [zod](https://github.com/colinhacks/zod) for your production applications.

# Gater

<img align="right" src="https://raw.githubusercontent.com/mbicknese/gater/main/logo.svg" height="150px" alt="the gater mascot alligator">

Gater is a simple, modern and secure object validator for JavaScript and TypeScript.

## Features

 - Validates values against schema's during runtime. Quickly know if external input matches the expected shape.
 - Utilizes TypeScript to type check known object shapes against the schema in build time.
 - Create re-usable validators, removing the need to pass the schema each time.

## Usage

Run a one-off validation to determine whether an object is valid

```TypeScript
isValid(
    { prey: "string", eaten: "boolean" },
    { prey: "fish", eaten: false } // Gater doesn't eat friends
);
// ✅ `true`, given value is valid
```

Create the validator in advance and validate multiple values

```TypeScript
const isFood = isValid({ prey: "string", eaten: "boolean" });

isFood({ prey: "frog", eaten: false });
// ✅ `true`, checks out
isFood({ prey: "seaweed", eaten: 5 });
// ❌ `false`, 5 is not a boolean
```

Use it to early catch issues with user input

```JavaScript
const isFood = isValid({ prey: "string" });

function onSubmit(food) {
    assert(isFood(food));
    // ... safely rely on food being food
}
```

### Node

Install from npmjs

```bash
npm i --save @bicknese/gater
```

And import the `isValid` function

```JavaScript
import { isValid } from '@bicknese/gater';
```

### Deno

Import directly through npm support

```TypeScript
import { isValid } from 'npm:@bicknese/gater';
```
