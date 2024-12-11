using System;

namespace EyeRide.FMS.Model.Infrastructure.Exceptions;

/// <summary>
/// Thrown when an operation fails due to reasons unrelated to validation,
/// authorization, or conflicts.
/// Use this exception to represent unexpected failures in business logic.
/// </summary>
public class OperationFailedException : DomainException
{
    public OperationFailedException(string message)
        : base(message)
    {
    }

    public OperationFailedException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
