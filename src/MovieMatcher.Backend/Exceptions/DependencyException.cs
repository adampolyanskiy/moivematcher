using System;

namespace EyeRide.FMS.Model.Infrastructure.Exceptions;

/// <summary>
/// Thrown when an external dependency fails or is unavailable.
/// Use this exception to represent errors caused by failures in external services,
/// databases, or APIs.
/// </summary>
public class DependencyException : DomainException
{
    public DependencyException(string message)
        : base(message)
    {
    }

    public DependencyException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}