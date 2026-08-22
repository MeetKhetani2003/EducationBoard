const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

c = c.replace(
  'import { FormEvent, useEffect, useState } from "react";',
  'import React, { FormEvent, useEffect, useState, useRef } from "react";'
);

fs.writeFileSync('app/page.tsx', c);
console.log('Fixed React ReferenceError');
