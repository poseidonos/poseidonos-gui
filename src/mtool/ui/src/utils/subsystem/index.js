const getSubsystemForArray = (subsystems, array) => {
  let subsystem = null;
  if (subsystems && subsystems.length) {
    subsystems.forEach((s) => {
      const isSubsystemOfArray = s.array === array;
      const isSubsystemDiscovery = s.subtype && s.subtype.toLowerCase() === "discovery";
      const isSubsystemFree = !isSubsystemDiscovery && !subsystem && !s.array;
      if (isSubsystemOfArray) {
        subsystem = s;
        return;
      }
      if (isSubsystemFree) {
        subsystem = s;
      }
    })
  }
  return subsystem ? subsystem.subnqn : "";
}

export default getSubsystemForArray;
