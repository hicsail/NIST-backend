/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/": {
    /**
     * Get JupyterHub version 
     * @description This endpoint is not authenticated for the purpose of clients and user
     * to identify the JupyterHub version before setting up authentication.
     */
    get: {
      responses: {
        /** @description The JupyterHub version */
        200: {
          content: {
            "application/json": {
              /** @description The version of JupyterHub itself */
              version?: string;
            };
          };
        };
      };
    };
  };
  "/info": {
    /**
     * Get detailed info about JupyterHub 
     * @description Detailed JupyterHub information, including Python version,
     * JupyterHub's version and executable path,
     * and which Authenticator and Spawner are active.
     */
    get: {
      responses: {
        /** @description Detailed JupyterHub info */
        200: {
          content: {
            "application/json": {
              /** @description The version of JupyterHub itself */
              version?: string;
              /** @description The Python version, as returned by sys.version */
              python?: string;
              /** @description The path to sys.executable running JupyterHub */
              sys_executable?: string;
              authenticator?: {
                /** @description The Python class currently active for JupyterHub Authentication */
                class?: string;
                /** @description The version of the currently active Authenticator */
                version?: string;
              };
              spawner?: {
                /** @description The Python class currently active for spawning single-user notebook servers */
                class?: string;
                /** @description The version of the currently active Spawner */
                version?: string;
              };
            };
          };
        };
      };
    };
  };
  "/user": {
    /** Return authenticated user's model */
    get: {
      responses: {
        /**
         * @description The authenticated user or service's model is returned
         * with additional information about the permissions associated with the request token.
         */
        200: {
          content: {
            "application/json": components["schemas"]["RequestIdentity"];
          };
        };
      };
    };
  };
  "/users": {
    /** List users */
    get: {
      parameters: {
        query?: {
          /**
           * @description Return only users who have servers in the given state.
           * If unspecified, return all users.
           * 
           * active: all users with any active servers (ready OR pending)
           * ready: all users who have any ready servers (running, not pending)
           * inactive: all users who have *no* active servers (complement of active)
           * 
           * Added in JupyterHub 1.3
           */
          state?: "inactive" | "active" | "ready";
          /**
           * @description Return a number users starting at the given offset.
           * Can be used with limit to paginate.
           * If unspecified, return all users.
           */
          offset?: number;
          /**
           * @description Return a finite number of users.
           * Can be used with offset to paginate.
           * If unspecified, use api_page_default_limit.
           */
          limit?: number;
          /**
           * @description Include stopped servers in user model(s).
           * Added in JupyterHub 3.0.
           * Allows retrieval of information about stopped servers,
           * such as activity and state fields.
           */
          include_stopped_servers?: boolean;
        };
      };
      responses: {
        /** @description The Hub's user list */
        200: {
          content: {
            "application/json": (components["schemas"]["User"])[];
          };
        };
      };
    };
    /** Create multiple users */
    post: {
      requestBody: {
        content: {
          "application/json": {
            /** @description list of usernames to create on the Hub */
            usernames?: (string)[];
            /** @description whether the created users should be admins */
            admin?: boolean;
          };
        };
      };
      responses: {
        /** @description The users have been created */
        201: {
          content: {
            "application/json": (components["schemas"]["User"])[];
          };
        };
      };
    };
  };
  "/users/{name}": {
    /** Get a user by name */
    get: {
      parameters: {
        path: {
          /** @description username */
          name: string;
        };
      };
      responses: {
        /** @description The User model */
        200: {
          content: {
            "application/json": components["schemas"]["User"];
          };
        };
      };
    };
    /** Create a single user */
    post: {
      parameters: {
        path: {
          /** @description username */
          name: string;
        };
      };
      responses: {
        /** @description The user has been created */
        201: {
          content: {
            "application/json": components["schemas"]["User"];
          };
        };
      };
    };
    /** Delete a user */
    delete: {
      parameters: {
        path: {
          /** @description username */
          name: string;
        };
      };
      responses: {
        /** @description The user has been deleted */
        204: {
          content: {
          };
        };
      };
    };
    /**
     * Modify a user 
     * @description Change a user's name or admin status
     */
    patch: {
      parameters: {
        path: {
          /** @description username */
          name: string;
        };
      };
      /** @description Updated user info. At least one key to be updated (name or admin) is required. */
      requestBody: {
        content: {
          "application/json": {
            /** @description the new name (optional, if another key is updated i.e. admin) */
            name?: string;
            /** @description update admin (optional, if another key is updated i.e. name) */
            admin?: boolean;
          };
        };
      };
      responses: {
        /** @description The updated user info */
        200: {
          content: {
            "application/json": components["schemas"]["User"];
          };
        };
      };
    };
  };
  "/users/{name}/activity": {
    /**
     * Notify Hub of activity for a given user. 
     * @description Notify the Hub of activity by the user, e.g. accessing a service or (more likely) actively using a server.
     */
    post: {
      parameters: {
        path: {
          /** @description username */
          name: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /**
             * Format: date-time 
             * @description Timestamp of last-seen activity for this user.
             * Only needed if this is not activity associated
             * with using a given server.
             */
            last_activity?: string;
            /**
             * @description Register activity for specific servers by name.
             * The keys of this dict are the names of servers.
             * The default server has an empty name ('').
             */
            servers?: {
              /** @description Activity for a single server. */
              "<server name>"?: {
                /**
                 * Format: date-time 
                 * @description Timestamp of last-seen activity on this server.
                 */
                last_activity: string;
              };
            };
          };
        };
      };
      responses: {
        /** @description Authentication/Authorization error */
        401: {
          content: {
          };
        };
        /** @description No such user */
        404: {
          content: {
          };
        };
      };
    };
  };
  "/users/{name}/server": {
    /** Start a user's single-user notebook server */
    post: {
      parameters: {
        path: {
          /** @description username */
          name: string;
        };
      };
      /**
       * @description Spawn options can be passed as a JSON body
       * when spawning via the API instead of spawn form.
       * The structure of the options
       * will depend on the Spawner's configuration.
       * The body itself will be available as `user_options` for the
       * Spawner.
       */
      requestBody?: {
        content: {
          "application/json": Record<string, never>;
        };
      };
      responses: {
        /** @description The user's notebook server has started */
        201: {
          content: {
          };
        };
        /** @description The user's notebook server has not yet started, but has been requested */
        202: {
          content: {
          };
        };
      };
    };
    /** Stop a user's server */
    delete: {
      parameters: {
        path: {
          /** @description username */
          name: string;
        };
      };
      responses: {
        /** @description The user's notebook server has not yet stopped as it is taking a while to stop */
        202: {
          content: {
          };
        };
        /** @description The user's notebook server has stopped */
        204: {
          content: {
          };
        };
      };
    };
  };
  "/users/{name}/servers/{server_name}": {
    /** Start a user's single-user named-server notebook server */
    post: {
      parameters: {
        path: {
          /** @description username */
          name: string;
          /**
           * @description name given to a named-server.
           * 
           * Note that depending on your JupyterHub infrastructure there are chracterter size limitation to `server_name`. Default spawner with K8s pod will not allow Jupyter Notebooks to be spawned with a name that contains more than 253 characters (keep in mind that the pod will be spawned with extra characters to identify the user and hub).
           */
          server_name: string;
        };
      };
      /**
       * @description Spawn options can be passed as a JSON body
       * when spawning via the API instead of spawn form.
       * The structure of the options
       * will depend on the Spawner's configuration.
       */
      requestBody?: {
        content: {
          "application/json": Record<string, never>;
        };
      };
      responses: {
        /** @description The user's notebook named-server has started */
        201: {
          content: {
          };
        };
        /** @description The user's notebook named-server has not yet started, but has been requested */
        202: {
          content: {
          };
        };
      };
    };
    /**
     * Stop a user's named server 
     * @description To remove the named server in addition to deleting it,
     * the body may be a JSON dictionary with a boolean `remove` field:
     * 
     * ```json
     * {"remove": true}
     * ```
     */
    delete: {
      parameters: {
        path: {
          /** @description username */
          name: string;
          /** @description name given to a named-server */
          server_name: string;
        };
      };
      responses: {
        /** @description The user's notebook named-server has not yet stopped as it is taking a while to stop */
        202: {
          content: {
          };
        };
        /** @description The user's notebook named-server has stopped */
        204: {
          content: {
          };
        };
      };
    };
  };
  "/users/{name}/tokens": {
    /** List tokens for the user */
    get: {
      parameters: {
        path: {
          /** @description username */
          name: string;
        };
      };
      responses: {
        /** @description The list of tokens */
        200: {
          content: {
            "application/json": (components["schemas"]["Token"])[];
          };
        };
        /** @description Authentication/Authorization error */
        401: {
          content: {
          };
        };
        /** @description No such user */
        404: {
          content: {
          };
        };
      };
    };
    /** Create a new token for the user */
    post: {
      parameters: {
        path: {
          /** @description username */
          name: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /** @description lifetime (in seconds) after which the requested token will expire. */
            expires_in?: number;
            /** @description A note attached to the token for future bookkeeping */
            note?: string;
            /**
             * @description A list of role names from which to derive scopes.
             * This is a shortcut for assigning collections of scopes;
             * Tokens do not retain role assignment.
             * (Changed in 3.0: roles are immediately resolved to scopes
             * instead of stored on roles.)
             */
            roles?: (string)[];
            /**
             * @description A list of scopes that the token should have.
             * (new in JupyterHub 3.0).
             */
            scopes?: (string)[];
          };
        };
      };
      responses: {
        /** @description The newly created token */
        201: {
          content: {
            "application/json": components["schemas"]["Token"];
          };
        };
        /** @description Body must be a JSON dict or empty */
        400: {
          content: {
          };
        };
        /** @description Requested role does not exist */
        403: {
          content: {
          };
        };
      };
    };
  };
  "/users/{name}/tokens/{token_id}": {
    /** Get the model for a token by id */
    get: {
      parameters: {
        path: {
          /** @description username */
          name: string;
          token_id: string;
        };
      };
      responses: {
        /** @description The info for the new token */
        200: {
          content: {
            "application/json": components["schemas"]["Token"];
          };
        };
      };
    };
    /** Delete (revoke) a token by id */
    delete: {
      parameters: {
        path: {
          /** @description username */
          name: string;
          token_id: string;
        };
      };
      responses: {
        /** @description The token has been deleted */
        204: {
          content: {
          };
        };
      };
    };
  };
  "/groups": {
    /** List groups */
    get: {
      parameters: {
        query?: {
          /**
           * @description Return a number of groups starting at the specified offset.
           * Can be used with limit to paginate.
           * If unspecified, return all groups.
           */
          offset?: number;
          /**
           * @description Return a finite number of groups.
           * Can be used with offset to paginate.
           * If unspecified, use api_page_default_limit.
           */
          limit?: number;
        };
      };
      responses: {
        /** @description The list of groups */
        200: {
          content: {
            "application/json": (components["schemas"]["Group"])[];
          };
        };
      };
    };
  };
  "/groups/{name}": {
    /** Get a group by name */
    get: {
      parameters: {
        path: {
          /** @description group name */
          name: string;
        };
      };
      responses: {
        /** @description The group model */
        200: {
          content: {
            "application/json": components["schemas"]["Group"];
          };
        };
      };
    };
    /** Create a group */
    post: {
      parameters: {
        path: {
          /** @description group name */
          name: string;
        };
      };
      responses: {
        /** @description The group has been created */
        201: {
          content: {
            "application/json": components["schemas"]["Group"];
          };
        };
      };
    };
    /** Delete a group */
    delete: {
      parameters: {
        path: {
          /** @description group name */
          name: string;
        };
      };
      responses: {
        /** @description The group has been deleted */
        204: {
          content: {
          };
        };
      };
    };
  };
  "/groups/{name}/users": {
    /** Add users to a group */
    post: {
      parameters: {
        path: {
          /** @description group name */
          name: string;
        };
      };
      /** @description The users to add to the group */
      requestBody: {
        content: {
          "application/json": {
            /** @description List of usernames to add to the group */
            users?: (string)[];
          };
        };
      };
      responses: {
        /** @description The users have been added to the group */
        200: {
          content: {
            "application/json": components["schemas"]["Group"];
          };
        };
      };
    };
    /**
     * Remove users from a group
     *  
     * @description Body should be a JSON dictionary
     * where `users` is a list of usernames to remove from the groups.
     * 
     * ```json
     * {
     *   "users": ["name1", "name2"]
     * }
     * ```
     */
    delete: {
      parameters: {
        path: {
          /** @description group name */
          name: string;
        };
      };
      responses: {
        /** @description The users have been removed from the group */
        200: {
          content: {
          };
        };
      };
    };
  };
  "/groups/{name}/properties": {
    /**
     * Set the group properties.
     * 
     * Added in JupyterHub 3.2.
     */
    put: {
      parameters: {
        path: {
          /** @description group name */
          name: string;
        };
      };
      /** @description The new group properties, as a JSON dict. */
      requestBody: {
        content: {
          "application/json": Record<string, never>;
        };
      };
      responses: {
        /**
         * @description The properties have been updated.
         * The updated group model is returned.
         */
        200: {
          content: {
            "application/json": components["schemas"]["Group"];
          };
        };
      };
    };
  };
  "/services": {
    /** List services */
    get: {
      responses: {
        /** @description The service list */
        200: {
          content: {
            "application/json": (components["schemas"]["Service"])[];
          };
        };
      };
    };
  };
  "/services/{name}": {
    /** Get a service by name */
    get: {
      parameters: {
        path: {
          /** @description service name */
          name: string;
        };
      };
      responses: {
        /** @description The Service model */
        200: {
          content: {
            "application/json": components["schemas"]["Service"];
          };
        };
      };
    };
  };
  "/proxy": {
    /**
     * Get the proxy's routing table 
     * @description A convenience alias for getting the routing table directly from the proxy
     */
    get: {
      parameters: {
        query?: {
          /**
           * @description Return a number of routes starting at the given offset.
           * Can be used with limit to paginate.
           * If unspecified, return all routes.
           */
          offset?: number;
          /**
           * @description Return a finite number of routes.
           * Can be used with offset to paginate.
           * If unspecified, use api_page_default_limit
           */
          limit?: number;
        };
      };
      responses: {
        /** @description Routing table */
        200: {
          content: {
            "application/json": Record<string, never>;
          };
        };
      };
    };
    /** Force the Hub to sync with the proxy */
    post: {
      responses: {
        /** @description Success */
        200: {
          content: {
          };
        };
      };
    };
    /**
     * Notify the Hub about a new proxy 
     * @description Notifies the Hub of a new proxy to use.
     */
    patch: {
      /** @description Any values that have changed for the new proxy. All keys are optional. */
      requestBody: {
        content: {
          "application/json": {
            /** @description IP address of the new proxy */
            ip?: string;
            /** @description Port of the new proxy */
            port?: string;
            /** @description Protocol of new proxy, if changed */
            protocol?: string;
            /** @description CONFIGPROXY_AUTH_TOKEN for the new proxy */
            auth_token?: string;
          };
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
          };
        };
      };
    };
  };
  "/authorizations/token": {
    /**
     * Request a new API token 
     * @description Request a new API token to use with the JupyterHub REST API.
     * If not already authenticated, username and password can be sent
     * in the JSON request body.
     * Logging in via this method is only available when the active Authenticator
     * accepts passwords (e.g. not OAuth).
     */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            username?: string;
            password?: string;
          };
        };
      };
      responses: {
        /** @description The new API token */
        200: {
          content: {
            "application/json": {
              /** @description The new API token. */
              token?: string;
            };
          };
        };
        /** @description The user can not be authenticated. */
        403: {
          content: {
          };
        };
      };
    };
  };
  "/authorizations/token/{token}": {
    /** Identify a user or service from an API token */
    get: {
      parameters: {
        path: {
          token: string;
        };
      };
      responses: {
        /** @description The user or service identified by the API token */
        200: {
          content: {
          };
        };
        /** @description A user or service is not found. */
        404: {
          content: {
          };
        };
      };
    };
  };
  "/authorizations/cookie/{cookie_name}/{cookie_value}": {
    /**
     * Identify a user from a cookie 
     * @deprecated 
     * @description Used by single-user notebook servers to hand off cookie authentication to the Hub
     */
    get: {
      parameters: {
        path: {
          cookie_name: string;
          cookie_value: string;
        };
      };
      responses: {
        /** @description The user identified by the cookie */
        200: {
          content: {
            "application/json": components["schemas"]["User"];
          };
        };
        /** @description A user is not found. */
        404: {
          content: {
          };
        };
      };
    };
  };
  "/oauth2/authorize": {
    /**
     * OAuth 2.0 authorize endpoint 
     * @description Redirect users to this URL to begin the OAuth process.
     * It is not an API endpoint.
     */
    get: {
      parameters: {
        query: {
          /** @description The client id */
          client_id: string;
          /** @description The response type (always 'code') */
          response_type: string;
          /** @description A state string */
          state?: string;
          /** @description The redirect url */
          redirect_uri: string;
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
          };
        };
        /** @description OAuth2Error */
        400: {
          content: {
          };
        };
      };
    };
  };
  "/oauth2/token": {
    /**
     * Request an OAuth2 token 
     * @description Request an OAuth2 token from an authorization code.
     * This request completes the OAuth process.
     */
    post: {
      requestBody: {
        content: {
          "application/x-www-form-urlencoded": {
            /** @description The client id */
            client_id: string;
            /** @description The client secret */
            client_secret: string;
            /** @description The grant type (always 'authorization_code') */
            grant_type: string;
            /** @description The code provided by the authorization redirect */
            code: string;
            /** @description The redirect url */
            redirect_uri: string;
          };
        };
      };
      responses: {
        /** @description JSON response including the token */
        200: {
          content: {
            "application/json": {
              /** @description The new API token for the user */
              access_token?: string;
              /** @description Will always be 'Bearer' */
              token_type?: string;
            };
          };
        };
      };
    };
  };
  "/shutdown": {
    /** Shutdown the Hub */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** @description Whether the proxy should be shutdown as well (default from Hub config) */
            proxy?: boolean;
            /** @description Whether users' notebook servers should be shutdown as well (default from Hub config) */
            servers?: boolean;
          };
        };
      };
      responses: {
        /** @description Shutdown successful */
        202: {
          content: {
          };
        };
        /** @description Unexpeced value for proxy or servers */
        400: {
          content: {
          };
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    User: {
      /** @description The user's name */
      name?: string;
      /** @description Whether the user is an admin */
      admin?: boolean;
      /** @description The names of roles this user has */
      roles?: (string)[];
      /** @description The names of groups where this user is a member */
      groups?: (string)[];
      /** @description The user's notebook server's base URL, if running; null if not. */
      server?: string;
      /**
       * @description The currently pending action, if any 
       * @enum {string}
       */
      pending?: "spawn" | "stop";
      /**
       * Format: date-time 
       * @description Timestamp of last-seen activity from the user
       */
      last_activity?: string;
      /**
       * @description The servers for this user.
       * By default: only includes _active_ servers.
       * Changed in 3.0: if `?include_stopped_servers` parameter is specified,
       * stopped servers will be included as well.
       */
      servers?: {
        [key: string]: components["schemas"]["Server"] | undefined;
      };
      /**
       * @description Authentication state of the user. Only available with admin:users:auth_state
       * scope. None otherwise.
       */
      auth_state?: Record<string, never>;
    };
    Server: {
      /** @description The server's name. The user's default server has an empty name ('') */
      name?: string;
      /**
       * @description Whether the server is ready for traffic.
       * Will always be false when any transition is pending.
       */
      ready?: boolean;
      /**
       * @description Whether the server is stopped. Added in JupyterHub 3.0,
       * and only useful when using the `?include_stopped_servers`
       * request parameter.
       * Now that stopped servers may be included (since JupyterHub 3.0),
       * this is the simplest way to select stopped servers.
       * Always equivalent to `not (ready or pending)`.
       */
      stopped?: boolean;
      /**
       * @description The currently pending action, if any.
       * A server is not ready if an action is pending.
       *  
       * @enum {string}
       */
      pending?: "spawn" | "stop";
      /**
       * @description The URL where the server can be accessed
       * (typically /user/:name/:server.name/).
       */
      url?: string;
      /** @description The URL for an event-stream to retrieve events during a spawn. */
      progress_url?: string;
      /**
       * Format: date-time 
       * @description UTC timestamp when the server was last started.
       */
      started?: string;
      /**
       * Format: date-time 
       * @description UTC timestamp last-seen activity on this server.
       */
      last_activity?: string;
      /** @description Arbitrary internal state from this server's spawner. Only available on the hub's users list or get-user-by-name method, and only with admin:users:server_state scope. None otherwise. */
      state?: Record<string, never>;
      /** @description User specified options for the user's spawned instance of a single-user server. */
      user_options?: Record<string, never>;
    };
    /**
     * @description The model for the entity making the request.
     * Extends User or Service model to add information about the specific credentials (e.g. session or token-authorised scopes).
     */
    RequestIdentity: (components["schemas"]["User"] | components["schemas"]["Service"]) & ({
      /**
       * @description The session id associated with the request's OAuth token, if any.
       * null, if the request token not associated with a session id.
       * 
       * Added in 2.0.
       */
      session_id?: string | null;
      /**
       * @description The list of all expanded scopes the request credentials have access to.
       * 
       * Added in 2.0.
       *  
       * @example [
       *   "read:users",
       *   "access:servers!user=name"
       * ]
       */
      scopes?: (string)[];
    });
    Group: {
      /** @description The group's name */
      name?: string;
      /** @description The names of users who are members of this group */
      users?: (string)[];
      /**
       * @description Group properties (a dictionary).
       * 
       * Unused by JupyterHub itself,
       * but an extension point to store information about groups.
       * 
       * Added in JupyterHub 3.2.
       */
      properties?: Record<string, never>;
      /** @description The names of roles this group has */
      roles?: (string)[];
    };
    Service: {
      /** @description The service's name */
      name?: string;
      /** @description Whether the service is an admin */
      admin?: boolean;
      /** @description The names of roles this service has */
      roles?: (string)[];
      /** @description The internal url where the service is running */
      url?: string;
      /** @description The proxied URL prefix to the service's url */
      prefix?: string;
      /** @description The PID of the service process (if managed) */
      pid?: number;
      /** @description The command used to start the service (if managed) */
      command?: (string)[];
      /**
       * @description Additional information a deployment can attach to a service.
       * JupyterHub does not use this field.
       */
      info?: Record<string, never>;
    };
    Token: {
      /** @description The token itself. Only present in responses to requests for a new token. */
      token?: string;
      /** @description The id of the API token. Used for modifying or deleting the token. */
      id?: string;
      /** @description The user that owns a token (undefined if owned by a service) */
      user?: string;
      /** @description The service that owns the token (undefined of owned by a user) */
      service?: string;
      /** @description Deprecated in JupyterHub 3, always an empty list. Tokens have 'scopes' starting from JupyterHub 3. */
      roles?: (string)[];
      /** @description List of scopes this token has been assigned. New in JupyterHub 3. In JupyterHub 2.x, tokens were assigned 'roles' insead of scopes. */
      scopes?: (string)[];
      /** @description A note about the token, typically describing what it was created for. */
      note?: string;
      /**
       * Format: date-time 
       * @description Timestamp when this token was created
       */
      created?: string;
      /**
       * Format: date-time 
       * @description Timestamp when this token expires. Null if there is no expiry.
       */
      expires_at?: string;
      /**
       * Format: date-time 
       * @description Timestamp of last-seen activity using this token.
       * Can be null if token has never been used.
       */
      last_activity?: string;
      /**
       * @description The session id associated with the token, if any.
       * Only used for tokens set during oauth flows.
       * 
       * Added in 2.0.
       */
      session_id?: string | null;
    };
  };
  responses: {
    /** @description The specified resource was not found */
    NotFound: {
      content: {
      };
    };
    /** @description Authentication/Authorization error */
    Unauthorized: {
      content: {
      };
    };
  };
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export type operations = Record<string, never>;