npm run build
12s
npm warn config production Use `--omit=dev` instead.
> smart-wardrobe@0.1.0 build
> next build
▲ Next.js 16.2.4 (Turbopack)
  Creating an optimized production build ...
✓ Compiled successfully in 3.2s
  Running TypeScript ...
Failed to type check.
./src/lib/auth.ts:30:13
Type error: Type '(credentials: Record<"email" | "password", string> | undefined) => Promise<{ id: string; name: string; email: string; role: string; status: "ACTIVE"; } | null>' is not assignable to type '(credentials: Record<"email" | "password", string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">) => Awaitable<...>'.

  Type 'Promise<{ id: string; name: string; email: string; role: string; status: "ACTIVE"; } | null>' is not assignable to type 'Awaitable<User | null>'.
    Type 'Promise<{ id: string; name: string; email: string; role: string; status: "ACTIVE"; } | null>' is not assignable to type 'PromiseLike<User | null>'.
      Types of property 'then' are incompatible.
        Type '<TResult1 = { id: string; name: string; email: string; role: string; status: "ACTIVE"; } | null, TResult2 = never>(onfulfilled?: ((value: { id: string; name: string; email: string; role: string; status: "ACTIVE"; } | null) => TResult1 | PromiseLike<...>) | null | undefined, onrejected?: ((reason: any) => TResult2 | ...' is not assignable to type '<TResult1 = User | null, TResult2 = never>(onfulfilled?: ((value: User | null) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<...>) | null | undefined) => PromiseLike<...>'.
          Types of parameters 'onfulfilled' and 'onfulfilled' are incompatible.
            Types of parameters 'value' and 'value' are incompatible.
              Type '{ id: string; name: string; email: string; role: string; status: "ACTIVE"; } | null' is not assignable to type 'User | null'.
                Type '{ id: string; name: string; email: string; role: string; status: "ACTIVE"; }' is not assignable to type 'User'.
                  Types of property 'role' are incompatible.
                    Type 'string' is not assignable to type '"ADMIN" | "USER"'.
  28 |         password: { label: "Password", type: "password" },
  29 |       },
> 30 |       async authorize(credentials) {
     |             ^
  31 |         if (!credentials?.email || !credentials?.password) {
  32 |           return null;
  33 |         }
Next.js build worker exited with code: 1 and signal: null
Build Failed: build daemon returned an error < failed to solve: process "npm run build" did not complete successfully: exit code: 1 >
