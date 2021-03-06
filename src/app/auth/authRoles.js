/**
 * Authorization Roles
 */
const authRoles = module => {
	try {
		const authRole = JSON.parse(localStorage.getItem('AuthRoles'));
		if (authRole) {
			return authRole[module].Role;
		}
		return ['G5lB/XDtp0QtlBa3ceR64UuE4aSyvD5b4koo7iNvGECLmJicAaUkHmasCaTmbSnHIv6xNYjKcg2PZIIlJ2R3WQ=='];
	} catch (e) {
		return ['G5lB/XDtp0QtlBa3ceR64UuE4aSyvD5b4koo7iNvGECLmJicAaUkHmasCaTmbSnHIv6xNYjKcg2PZIIlJ2R3WQ=='];
	}
};

export default authRoles;
